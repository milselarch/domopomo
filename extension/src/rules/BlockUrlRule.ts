import { wildcardToRegExp } from '~/misc'
import type { BaseRuleParams, BrowseState, RuleInterface } from '~/rules/BaseRule'
import {
  BaseRule, MatchPatternType,
} from '~/rules/BaseRule'

export type BlockUrlRuleParams = BaseRuleParams & {
  matchPattern: string
  matchPatternType: MatchPatternType
  timeout: number | null
}

class BlockUrlRule extends BaseRule<BlockUrlRule> implements RuleInterface {
  private matchPattern: string
  private matchPatternType: MatchPatternType
  private timeout: number | null

  constructor({
    id = null,
    isReadOnly = false,
    blockType, matchPattern, matchPatternType,
    timeout,
  }: BlockUrlRuleParams) {
    super({ id, isReadOnly, blockType })
    this.matchPattern = matchPattern
    this.matchPatternType = matchPatternType
    this.timeout = timeout
  }

  override test(input: BrowseState): boolean {
    let { url } = input
    let matcher = this.matchPattern
    let regexMatcher: RegExp

    switch (this.matchPatternType) {
      case MatchPatternType.TEXT:
        matcher = matcher.replace(/^https?:\/\//i, '')
        // strip out query string
        // TODO: should we strip out the query string?
        //  (maybe make it an option?)
        url = url.replace(/\?.*$/, '')
        return url === matcher
      case MatchPatternType.WILDCARD:
        regexMatcher = wildcardToRegExp(matcher)
        return url.match(regexMatcher) !== null
      case MatchPatternType.REGEX:
        regexMatcher = new RegExp(matcher)
        return url.match(regexMatcher) !== null
      default:
        throw new Error('Invalid matchPatternType')
    }
  }

  override isDifferent(other: BlockUrlRule) {
    return (
      super.isDifferent(other)
      || this.matchPattern !== other.matchPattern
      || this.matchPatternType !== other.matchPatternType
      || this.timeout !== other.timeout
    )
  }
}
