export interface IJourneyUpdateRequest {
  readonly journey: {
    readonly name?: string
    readonly state?: State
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
  readonly data: IActionData
  readonly position: number
  readonly journey_id: number
  readonly id: number
}

export interface IActionData {
  readonly field_id?: number
  readonly for?: number
  readonly value?: string
  readonly owner_id?: number
  readonly template_id?: number
  readonly send_from_owner?: boolean
  readonly stage_id?: number
}

export type ActionType =
  | 'assign_lead_owner'
  | 'assign_stage'
  | 'remove_from_journey'
  | 'send_email'
  | 'send_text'
  | 'update_field'
  | 'wait'

export type State = 'active' | 'inactive'

export interface ITrigger {
  readonly type: TriggerType
  readonly journey_id: number
  readonly id: number
  readonly data: ITriggerData
}

export type TriggerType =
  | 'field_updated'
  | 'pipeline_assigned'
  | 'stage_assigned'
  | 'phone_number_updated'
  | 'email_updated'

export interface ITriggerData {
  readonly stage_id?: number
  readonly value?: string
  readonly field_id?: number
  readonly email?: string
  readonly phone_number?: string
  readonly pipeline_id?: number
}

interface ILinks {
  readonly prev: string | null
  readonly next: string | null
}
