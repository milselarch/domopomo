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

export interface BrowseState {
  url: string
  timestamp: number
}

export interface RuleInterface {
  getID(): number | null
  getBlockType(): BlockType
  test(input: BrowseState): boolean
  isDifferent(other: RuleInterface): boolean
}

export interface BaseRuleParams {
  id: number | null
  ordering: number | null
  name: string
  isReadOnly: boolean
  blockType: BlockType
}

export abstract class BaseRule<
  TSelf extends RuleInterface,
> implements RuleInterface {
  private readonly blockType: BlockType
  private isReadOnly: boolean
  private ordering: number | null
  private saved: boolean
  private name: string
  private id: number | null

  protected constructor(params: BaseRuleParams | null = null) {
    if (params === null) {
      params = this.generateDefaultParams()
    }
    this.id = params.id
    this.name = params.name
    this.ordering = params.ordering
    this.blockType = params.blockType
    this.isReadOnly = params.isReadOnly
    this.saved = false
  }

  generateDefaultParams(): BaseRuleParams {
    const blockType = this.getBlockType()
    return {
      id: null,
      name: '',
      ordering: null,
      isReadOnly: false,
      blockType: blockType,
    }
  }

  abstract getBlockType(): BlockType

  getID(): number | null {
    return this.id
  }

  test(/*input: BrowseState*/): boolean {
    return false
  }

  isDifferent(other: TSelf) {
    if (other.getBlockType() !== this.getBlockType()) {
      return true
    }
    const otherRule = other as unknown as BaseRule<RuleInterface>
    return (
      this.blockType !== otherRule.blockType
      || this.isReadOnly !== otherRule.isReadOnly
      || this.saved !== otherRule.saved
      || this.name !== otherRule.name
      || this.ordering !== otherRule.ordering
    )
  }
}

export enum MatchPatternType {
  TEXT = 'TEXT',
  WILDCARD = 'WILDCARD',
  REGEX = 'REGEX',
}
