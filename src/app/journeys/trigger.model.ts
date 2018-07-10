import * as API from './journeys.api.model'

export class Trigger {
  readonly id: number | undefined
  tempId: string
  readonly type: API.TriggerType
  readonly journeyId: number
  data: API.TriggerData

  constructor(data: API.ITrigger, tempId?: string) {
    this.id = data.id
    this.type = data.type
    this.journeyId = data.journey_id
    this.data = data.data

    if (tempId) this.tempId = tempId
  }

  public toApiRepresentation(): API.ITrigger {
    return {
      data: this.data,
      id: this.id,
      journey_id: this.journeyId,
      type: this.type
    }
  }

  public getId(): number | string {
    if (this.id) {
      return this.id
    } else {
      return this.tempId
    }
  }
}
