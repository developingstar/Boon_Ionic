import { ensureNonEmptyString, ensureNumber } from '../utils/validators'
import * as API from './groups.api.model'

export class Group {
  readonly id: number
  readonly name: string
  readonly userCount: number

  constructor(data: API.IGroup) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.userCount = data.user_count
  }
}
