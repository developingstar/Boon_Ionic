import { ensureNonEmptyString, ensureNumber } from '../utils/validators'

export class Note {
  readonly id: number
  readonly content: string
  readonly date: string

  constructor(data: Crm.API.INote) {
    this.id = ensureNumber(data.id)
    this.content = ensureNonEmptyString(data.content)
    this.date = data.inserted_at
  }
}
