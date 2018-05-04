import * as API from './journeys.api.model'

export class Action {
  readonly id: number | undefined
  readonly type: API.ActionType
  readonly data: API.ActionData
  readonly position: number | undefined
  readonly journeyId: number

  constructor(data: API.IAction) {
    this.id = data.id
    this.type = data.type
    this.data = data.data
    this.position = data.position
    this.journeyId = data.journey_id
  }

  public toApiRepresentation(): API.IAction {
    return {
      data: this.data,
      id: this.id,
      journey_id: this.journeyId,
      position: this.position,
      type: this.type
    }
  }
}
