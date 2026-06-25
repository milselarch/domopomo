import { wildcardToRegExp } from '~/misc'

export enum BlockType {
  BLOCK_URL = 'BLOCK_URL',
  POMODORO = 'POMODORO',
  PASSWORD_GROUP = 'PASSWORD_GROUP',
  // block embedded content (video, links etc.)
  BLOCK_EMBEDS = 'BLOCK_EMBEDS',
  // set time limits for doing something otherwise blocked
  TIME_LIMIT_GROUP = 'TIMER_GROUP',
  // aggregate a group of rules by OR, AND, etc.
  AGGREGATION_GROUP = 'AGGREGATION_GROUP',
}

interface BaseRuleParams {
  id: number | null
  blockType?: BlockType
}

export class BaseRule {
  private blockType: BlockType
  private saved: boolean
  private id: number | null

  constructor({
    id = null,
    blockType = BlockType.BLOCK_URL,
  }: BaseRuleParams) {
    this.id = id
    this.blockType = blockType
    this.saved = false
  }
}

export enum MatchPatternType {
  TEXT = 'TEXT',
  WILDCARD = 'WILDCARD',
  REGEX = 'REGEX',
}

export type BlockUrlRuleParams = BaseRuleParams & {
  matchPattern: string
  matchPatternType: MatchPatternType
}

class BlockUrlRule extends BaseRule {
  private matchPattern: string
  private matchPatternType: MatchPatternType

  constructor({
    id, blockType, matchPattern, matchPatternType,
  }: BlockUrlRuleParams) {
    super({ id, blockType })
    this.matchPattern = matchPattern
    this.matchPatternType = matchPatternType
  }

  test(url: string) {
    let matcher = this.matchPattern
    let regexMatcher: RegExp

    switch (this.matchPatternType) {
      case MatchPatternType.TEXT:
        matcher = matcher.replace(/^https?:\/\//i, '')
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
}
