import * as API from './journeys.api.model'

export class Trigger {
  readonly id: number | undefined
  readonly type: API.TriggerType
  readonly journey_id: number
  readonly data: API.TriggerData

  constructor(data: API.ITrigger) {
    this.id = data.id
    this.type = data.type
    this.journey_id = data.journey_id
    this.data = data.data
  }
}
