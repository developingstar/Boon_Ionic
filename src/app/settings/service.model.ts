import * as API from './integrations.api.model'

export class Trigger {
  readonly id: number
  readonly token: string
  readonly name: string

  constructor(data: API.IServiceData) {
    this.id = data.id
    this.token = data.token
    this.name = data.name
  }
}
