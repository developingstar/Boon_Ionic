import * as moment from 'moment'
import { User } from '../auth/user.model'
import { ensureNumber } from '../utils/validators'
import { Field } from './field.model'

export class Contact {
  readonly createdByServiceId: number | null
  readonly createdByUserId: number | null
  readonly email: string | null
  readonly firstName: string | null
  readonly lastName: string | null
  readonly fields: ReadonlyArray<Field>
  readonly id: number
  readonly owner: User | null
  readonly phoneNumber: string
  readonly stageId: number
  readonly insertedAt: string
  readonly updatedAt: string

  constructor(data: Crm.API.IContact) {
    this.createdByServiceId = data.created_by_service_id
    this.createdByUserId = data.created_by_user_id
    this.email = data.email
    this.firstName = data.first_name
    this.lastName = data.last_name
    this.email = data.email
    this.fields = data.fields.map((raw: Crm.API.IField) => new Field(raw))
    this.id = ensureNumber(data.id)
    this.phoneNumber = data.phone_number
    this.stageId = data.stage_id
    this.insertedAt = data.inserted_at
      ? moment(data.inserted_at, moment.ISO_8601).format(
          'DD MMM YYYY hh:mm:ss a'
        )
      : moment(new Date(), moment.ISO_8601).format('DD MMM YYYY hh:mm:ss a')
    this.updatedAt = data.updated_at
      ? moment(data.updated_at, moment.ISO_8601).format('dd  MM  yyyy hh mm ss')
      : moment(new Date(), moment.ISO_8601).format('dd  MM  yyyy hh mm ss')
    if (data.owner) {
      this.owner = new User(data.owner)
    }
  }

  get name(): string | null {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    } else {
      return this.firstName || this.lastName
    }
  }

  public searchDisplayName(): string {
    let displayName = ''
    if (this.name) displayName = this.name
    else if (this.email) displayName = this.email
    else if (this.phoneNumber) displayName = this.phoneNumber
    return displayName
  }

  public formatDate(strDate: string): Date {
    if (strDate) {
      return strDate.substr(-1) === 'Z' || strDate.substr(-1) === 'z'
        ? new Date(strDate)
        : new Date(strDate + 'Z')
    } else {
      return new Date()
    }
  }
}
