import { Action } from './action.model'
import * as API from './journeys.api.model'
import { Trigger } from './trigger.model'

export class Journey {
  readonly id: number
  readonly name: string
  readonly state: API.State
  readonly published_at: string | null
  readonly actions: ReadonlyArray<Action>
  readonly triggers: ReadonlyArray<Trigger>

  constructor(data: API.IJourney) {
    this.id = data.id
    this.name = data.name
    this.state = data.state
    this.published_at = data.published_at
    this.actions = data.actions.map((action) => new Action(action))
    this.triggers = data.triggers.map((trigger) => new Trigger(trigger))
  }
}
