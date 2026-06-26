export enum BlockType {
  BLOCK_PROGRAM = 'BLOCK_PROGRAM',
  POMODORO = 'POMODORO',
  PASSWORD_GROUP = 'PASSWORD_GROUP',
  // block embedded content (video, links etc.)
  // set time limits for doing something otherwise blocked
  TIME_LIMIT_GROUP = 'TIMER_GROUP',
  // aggregate a group of rules by OR, AND, etc.
  AGGREGATION_GROUP = 'AGGREGATION_GROUP',
}

export interface DesktopState {
  // TODO: get the list of running programs from the OS and pass it here
  programs: string[]
  timestamp: number
}

export interface RuleInterface {
  getID(): number | null
  getBlockType(): BlockType
  test(input: DesktopState): boolean
  isDifferent(other: RuleInterface): boolean
}

export interface BaseRuleParams {
  id: number | null
  isReadOnly: boolean
  blockType?: BlockType
}

export abstract class BaseRule<
  TSelf extends BaseRule<TSelf>,
> implements RuleInterface {
  private readonly blockType: BlockType
  private isReadOnly: boolean
  private saved: boolean
  private id: number | null

  constructor({
    id = null,
    isReadOnly = false,
    blockType = BlockType.BLOCK_URL,
  }: BaseRuleParams) {
    this.id = id
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

  test(input: DesktopState): boolean {
    return false
  }

  isDifferent(other: TSelf) {
    return (
      this.blockType !== other.blockType
      || this.isReadOnly !== other.isReadOnly
      || this.saved !== other.saved
    )
  }
}

export enum MatchPatternType {
  TEXT = 'TEXT',
  WILDCARD = 'WILDCARD',
  REGEX = 'REGEX',
}
