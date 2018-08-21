import { ensureNonEmptyString, ensureNumber } from '../utils/validators'
import * as API from './groups.api.model'

export class Group {
  readonly id: number
  readonly name: string

  constructor(data: API.IGroup) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
  }
}
