import { ensureNonEmptyString, ensureNumber } from '../utils/validators'

export class FieldDefinition {
  readonly id: number
  readonly name: string

  constructor(data: Crm.API.IFieldDefinition) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
  }
}
