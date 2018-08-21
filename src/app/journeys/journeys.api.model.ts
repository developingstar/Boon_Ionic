import { Action } from './action.model'
import { Trigger } from './trigger.model'

export interface IJourneyUpdateRequest {
  readonly journey: {
    readonly actions?: ReadonlyArray<IAction>
    readonly name?: string
    readonly state?: State
    readonly triggers?: ReadonlyArray<ITrigger>
  }
}

export interface IJourneyCreateRequest {
  readonly journey: {
    readonly actions: ReadonlyArray<IAction>
    readonly name?: string
    readonly state?: State
    readonly triggers: ReadonlyArray<ITrigger>
  }
}

export interface IJourneysResponse {
  readonly links: ILinks
  readonly data: IJourneysData
}

export interface IJourneyResponse {
  readonly data: IJourneyData
}

interface IJourneysData {
  readonly journeys: ReadonlyArray<IJourney>
}

interface IJourneyData {
  readonly journey: IJourney
}

export interface IJourney {
  readonly id: number
  readonly name: string
  readonly state: State
  readonly published_at: string | null
  readonly actions: ReadonlyArray<IAction>
  readonly triggers: ReadonlyArray<ITrigger>
}

export interface IAction {
  readonly type: ActionType
  readonly data: ActionData
  readonly position?: number
  readonly journey_id: number
  readonly id?: number
}

export type ActionType =
  | 'assign_owner'
  | 'assign_stage'
  | 'remove_from_journey'
  | 'send_email'
  | 'send_text'
  | 'update_field'
  | 'wait'

export interface IAssignOwnerData {
  readonly owner_id: number
}

export interface IAssignStageData {
  readonly stage_id: number
}

export interface IRemoveFromJourneyData {
  readonly journey_id: number
}

export interface ISendEmailData {
  readonly template_id: number
  readonly send_from_owner: boolean
}

export interface ISendTextData {
  readonly template_id: number
  readonly send_from_owner: boolean
}

export interface IUpdateFieldData {
  readonly field_id: number
  readonly value: string
}

export interface IWaitData {
  readonly for: number
}

export type ActionData =
  | IAssignOwnerData
  | IAssignStageData
  | IRemoveFromJourneyData
  | ISendEmailData
  | ISendTextData
  | IUpdateFieldData
  | IWaitData

export type State = 'active' | 'inactive'

export interface ITrigger {
  readonly type: TriggerType
  readonly journey_id: number
  readonly id?: number
  readonly data: TriggerData
}

export type TriggerType =
  | 'field_updated'
  | 'pipeline_assigned'
  | 'stage_assigned'

export interface IFieldUpdatedData {
  readonly field_id: number
  readonly value: string
}

export interface IPipelineAssignedData {
  readonly pipeline_id: number
}

export interface IStageAssignedData {
  readonly stage_id: number
}

export type TriggerData =
  | IFieldUpdatedData
  | IPipelineAssignedData
  | IStageAssignedData

interface ILinks {
  readonly prev: string | null
  readonly next: string | null
}

export interface IContactOwnerEvent extends Action {
  readonly data: IAssignOwnerData
}

interface IStageAssignedTrigger extends Trigger {
  readonly data: IStageAssignedData
}

interface IAssignStageAction extends Action {
  readonly data: IAssignStageData
}

export type IStageEvent = IStageAssignedTrigger | IAssignStageAction

export interface IPipelineEvent extends Trigger {
  readonly data: IPipelineAssignedData
}

interface IFieldUpdatedTrigger extends Trigger {
  readonly data: IFieldUpdatedData
}

interface IUpdateFieldAction extends Action {
  readonly data: IUpdateFieldData
}

export type IFieldEvent = IFieldUpdatedTrigger | IUpdateFieldAction

export interface ITextTemplateEvent extends Action {
  readonly data: ISendTextData
}

export interface IEmailTemplateEvent extends Action {
  readonly data: ISendEmailData
}

export interface IWaitEvent extends Action {
  readonly data: IWaitData
}
