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
  name: string
  isReadOnly: boolean
  blockType?: BlockType
}

export abstract class BaseRule<
  TSelf extends BaseRule<TSelf>,
> implements RuleInterface {
  private readonly blockType: BlockType
  private isReadOnly: boolean
  private saved: boolean
  private name: string
  private id: number | null

  constructor({
    id,
    name,
    isReadOnly = false,
    blockType = BlockType.BLOCK_URL,
  }: BaseRuleParams) {
    this.id = id
    this.name = name
    this.blockType = blockType
    this.isReadOnly = isReadOnly
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

  isDifferent(other: TSelf) {
    return (
      this.blockType !== other.blockType
      || this.isReadOnly !== other.isReadOnly
      || this.saved !== other.saved
      || this.name !== other.name
    )
  }
}

export enum MatchPatternType {
  TEXT = 'TEXT',
  WILDCARD = 'WILDCARD',
  REGEX = 'REGEX',
}
