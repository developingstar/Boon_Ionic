import { FormControl, Validators } from '@angular/forms'
import { Action } from './action.model'
import { Journey } from './journey.model'
import { Trigger } from './trigger.model'

interface IAction<T extends string> {
  readonly name: T
}

interface IInitAction extends IAction<'init'> {}

interface IStopJourneyAction extends IAction<'stop_journey'> {}

interface IPublishJourneyAction extends IAction<'publish_journey'> {}

interface IAddActionAction extends IAction<'add_action'> {
  readonly action: Action
}

interface IUpdateActionAction extends IAction<'update_action'> {
  readonly action: Action
}

interface IDeleteActionAction extends IAction<'delete_action'> {
  readonly action: Action
}

interface IAddTriggerAction extends IAction<'add_trigger'> {
  readonly trigger: Trigger
}

interface IUpdateTriggerAction extends IAction<'update_trigger'> {
  readonly trigger: Trigger
}

interface IDeleteTriggerAction extends IAction<'delete_trigger'> {
  readonly trigger: Trigger
}

interface IRenameJourneyAction extends IAction<'rename_journey'> {}

interface IReorderActionsAction extends IAction<'reorder_actions'> {
  readonly oldPosition: number
  readonly newPosition: number
}

export type UserAction =
  | IInitAction
  | IStopJourneyAction
  | IPublishJourneyAction
  | IAddActionAction
  | IUpdateActionAction
  | IDeleteActionAction
  | IReorderActionsAction
  | IAddTriggerAction
  | IUpdateTriggerAction
  | IDeleteTriggerAction
  | IRenameJourneyAction

export interface IState {
  readonly isLoading: boolean
  readonly journey?: Journey
  readonly name: FormControl
}

export const initialState: IState = {
  isLoading: false,
  journey: undefined,
  name: new FormControl('', Validators.required)
}
