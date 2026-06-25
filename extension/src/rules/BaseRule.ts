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

interface BrowseState {
  url: string
  timestamp: number
}

export interface RuleInterface {
  getID(): number | null
  getBlockType(): BlockType
  test(input: BrowseState): boolean
  isDifferent(other: this): boolean
}

interface BaseRuleParams {
  id: number | null
  blockType?: BlockType
}

export class BaseRule implements RuleInterface {
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

  getBlockType(): BlockType {
    return this.blockType
  }

  getID(): number | null {
    return this.id
  }

  test(input: BrowseState): boolean {
    return false
  }

  isDifferent(other: BaseRule) {
    return (
      this.blockType !== other.blockType ||
      this.saved !== other.saved
    )
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

class BlockUrlRule extends BaseRule implements RuleInterface {
  private matchPattern: string
  private matchPatternType: MatchPatternType

  constructor({
    id, blockType, matchPattern, matchPatternType,
  }: BlockUrlRuleParams) {
    super({ id, blockType })
    this.matchPattern = matchPattern
    this.matchPatternType = matchPatternType
  }

  override test(url: string) {
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

  override isDifferent(other: BlockUrlRule) {
    return (
      super.isDifferent(other) ||
      this.matchPattern !== other.matchPattern ||
      this.matchPatternType !== other.matchPatternType
    )
  }
}
