import { BaseRule } from '~/rules/BaseRule'

export type PomodoroRuleParams = BaseRuleParams & {
  duration: number
  shortBreakDuration: number
  longBreakDuration: number
}

class PomodoroRule extends BaseRule<PomodoroRule> {
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

  override isDifferent(other: PomodoroRule): boolean {
    return (
      super.isDifferent(other)
      || this.duration !== other.duration
      || this.shortBreakDuration !== other.shortBreakDuration
      || this.longBreakDuration !== other.longBreakDuration
    )
  }
}
