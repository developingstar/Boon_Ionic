import * as API from './integration.api.model'

export class Service {
  readonly id: number
  readonly token: string
  readonly name: string

  constructor(data: API.IService) {
    if (data) {
      this.id = data.id
      this.token = data.token
      this.name = data.name
    }
  }
}
