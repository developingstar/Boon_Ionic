import * as API from './journeys.api.model'

export class Trigger {
  readonly id: number | undefined
  readonly type: API.TriggerType
  readonly journeyId: number
  readonly data: API.TriggerData

  constructor(data: API.ITrigger) {
    this.id = data.id
    this.type = data.type
    this.journeyId = data.journey_id
    this.data = data.data
  }

  public toApiRepresentation(): API.ITrigger {
    return {
      data: this.data,
      id: this.id,
      journey_id: this.journeyId,
      type: this.type
    }
  }
}
