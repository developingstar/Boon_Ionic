import { User } from '../auth/user.model'
import { ensureNonEmptyString, ensureNumber } from '../utils/validators'
import { Field } from './field.model'

export class Lead {
  readonly created_by_service_id: number | null
  readonly created_by_user_id: number | null
  readonly email: string | null
  readonly fields: ReadonlyArray<Field>
  readonly id: number
  readonly owner: User | null
  readonly phone_number: string
  readonly stage_id: number

  constructor(data: Crm.API.ILead) {
    this.created_by_service_id = data.created_by_service_id
    this.created_by_user_id = data.created_by_user_id
    this.email = data.email
    this.fields = data.fields.map((raw: Crm.API.IField) => new Field(raw))
    this.id = ensureNumber(data.id)
    this.phone_number = ensureNonEmptyString(data.phone_number)
    this.stage_id = ensureNumber(data.stage_id)

    if (data.owner) {
      this.owner = new User(data.owner)
    }
  }

  get name(): string | undefined {
    const firstName = this.fieldValueByName('First Name')
    const lastName = this.fieldValueByName('Last Name')

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    } else {
      return firstName || lastName
    }
  }

  private fieldValueByName(name: string): string | undefined {
    const field: Field | undefined = this.fields.find((f) => f.name === name)

    if (field instanceof Field) {
      return field.value
    } else {
      return undefined
    }
  }
}
