import {BaseRuleParams, BlockType, BrowseState, RuleInterface} from '~/rules/BaseRule'
import { BaseRule } from '~/rules/BaseRule'

export type PomodoroRuleParams = BaseRuleParams & {
  duration: number
  shortBreakDuration: number
  longBreakDuration: number
}

export class PomodoroRule extends BaseRule<RuleInterface> {
  private duration: number
  private shortBreakDuration: number
  private longBreakDuration: number

  constructor(params: PomodoroRuleParams) {
    const baseParams: BaseRuleParams = params
    super(baseParams)

    this.duration = params.duration
    this.shortBreakDuration = params.shortBreakDuration
    this.longBreakDuration = params.longBreakDuration
  }

  override test(input: BrowseState): boolean {
    // TODO: implement this
    // TODO: there needs to be a separate pomodoro state
    return false
  }

  override getBlockType(): BlockType {
    return BlockType.POMODORO
  }

  override isDifferent(other: BaseRule<RuleInterface>): boolean {
    if (other.getBlockType() !== this.getBlockType()) {
      return true
    }
    const otherRule = other as unknown as PomodoroRule
    return (
      super.isDifferent(other)
      || this.duration !== otherRule.duration
      || this.shortBreakDuration !== otherRule.shortBreakDuration
      || this.longBreakDuration !== otherRule.longBreakDuration
    )
  }
}
