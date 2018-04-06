import * as API from './integrations.api.model'

export class Service {
  readonly id: number
  readonly token: string
  readonly name: string

  constructor(data: API.IService) {
    this.id = data.id
    this.token = data.token
    this.name = data.name
  }
}
