import { Action } from './action.model'
import * as API from './journeys.api.model'
import { Trigger } from './trigger.model'

export class Journey {
  readonly id: number
  readonly name: string
  readonly state: API.State
  readonly publishedAt: string | null
  readonly actions: ReadonlyArray<Action>
  readonly triggers: ReadonlyArray<Trigger>

  constructor(data: API.IJourney) {
    this.id = data.id
    this.name = data.name
    this.state = data.state
    this.publishedAt = data.published_at
    this.actions = data.actions.map((action) => new Action(action))
    this.triggers = data.triggers.map((trigger) => new Trigger(trigger))
  }

  public toApiRepresentation(): API.IJourney {
    return {
      actions: this.actions.map((action) => {
        return action.toApiRepresentation()
      }),
      id: this.id,
      name: this.name,
      published_at: this.publishedAt,
      state: this.state,
      triggers: this.triggers.map((trigger) => {
        return trigger.toApiRepresentation()
      })
    }
  }
}
