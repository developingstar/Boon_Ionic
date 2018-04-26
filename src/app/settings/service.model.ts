import { ensureNonEmptyString, ensureNumber } from '../utils/validators'
import * as API from './integration.api.model'

export class Service {
  readonly id: number
  readonly token: string
  readonly name: string

  constructor(data: API.IService) {
    this.id = ensureNumber(data.id)
    this.token = ensureNonEmptyString(data.token)
    this.name = ensureNonEmptyString(data.name)
  }
}
