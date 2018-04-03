import { Journey } from './journey.model'

interface IAction<T extends string> {
  readonly name: T
}

interface IInitAction extends IAction<'init'> {}

interface IStopJourneyAction extends IAction<'stop_journey'> {}

interface IPublishJourneyAction extends IAction<'publish_journey'> {}

export type UserAction =
  | IInitAction
  | IStopJourneyAction
  | IPublishJourneyAction

export interface IState {
  readonly isLoading: boolean
  readonly journey?: Journey
}

export const initialState: IState = {
  isLoading: false,
  journey: undefined
}
