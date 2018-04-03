import * as API from './journeys.api.model'

export class Trigger {
  readonly id: number
  readonly type: API.TriggerType
  readonly journey_id: number
  readonly data: API.ITriggerData

  constructor(data: API.ITrigger) {
    this.id = data.id
    this.type = data.type
    this.journey_id = data.journey_id
    this.data = data.data
  }
}
