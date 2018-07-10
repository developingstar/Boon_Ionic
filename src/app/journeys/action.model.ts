import * as API from './journeys.api.model'

export class Action {
  id: number | undefined
  tempId: string
  readonly type: API.ActionType
  data: API.ActionData
  position: number | undefined
  readonly journeyId: number

  constructor(data: API.IAction, tempId?: string) {
    this.id = data.id
    this.type = data.type
    this.data = data.data
    this.position = data.position
    this.journeyId = data.journey_id

    if (tempId) this.tempId = tempId
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

  public getId(): number | string {
    if (this.id) {
      return this.id
    } else {
      return this.tempId
    }
  }
}
