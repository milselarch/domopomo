import { wildcardToRegExp } from '~/misc'
import {
  BaseRuleParams, BlockType, BrowseState, RuleInterface,
} from '~/rules/BaseRule'
import {
  BaseRule, MatchPatternType,
} from '~/rules/BaseRule'

export type BlockUrlRuleParams = BaseRuleParams & {
  matchPattern: string
  matchPatternType: MatchPatternType
  timeout: number
}

export class BlockUrlRule extends BaseRule<RuleInterface> {
  private matchPattern: string
  private matchPatternType: MatchPatternType
  private timeout: number | null

  constructor(params: BlockUrlRuleParams | null = null) {
    super(params)
    if (params === null) {
      params = this.generateDefaultParams()
    }
    this.matchPattern = params.matchPattern
    this.matchPatternType = params.matchPatternType
    this.timeout = params.timeout
  }

  override generateDefaultParams(): BlockUrlRuleParams {
    return {
      ...super.generateDefaultParams(),
      matchPattern: '',
      matchPatternType: MatchPatternType.TEXT,
      timeout: 0,
      blockType: BlockType.BLOCK_URL,
    }
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

  getBlockType(): BlockType {
    return BlockType.BLOCK_URL
  }

  override isDifferent(other: BaseRule<never>): boolean {
    if (other.getBlockType() !== this.getBlockType()) {
      return true
    }
    const otherRule = other as unknown as BlockUrlRule
    return (
      super.isDifferent(other)
      || this.matchPattern !== otherRule.matchPattern
      || this.matchPatternType !== otherRule.matchPatternType
      || this.timeout !== otherRule.timeout
    )
  }
}
