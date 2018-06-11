import { ensureNonEmptyString, ensureNumber } from '../utils/validators'

export class Note {
  readonly id: number
  readonly content: string

  constructor(data: Crm.API.INote) {
    this.id = ensureNumber(data.id)
    this.content = ensureNonEmptyString(data.content)
  }
}
