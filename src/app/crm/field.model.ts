import { ensureNonEmptyString, ensureNumber } from '../utils/validators'

export class Field {
  readonly id: number
  readonly name: string
  readonly value: string

  constructor(data: Crm.API.IField) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.value = data.value
  }
}
