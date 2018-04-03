import * as API from './journeys.api.model'

export class Action {
  readonly id: number
  readonly type: API.ActionType
  readonly data: API.IActionData
  readonly position: number
  readonly journey_id: number

  constructor(data: API.IAction) {
    this.id = data.id
    this.type = data.type
    this.data = data.data
    this.position = data.position
    this.journey_id = data.journey_id
  }
}
