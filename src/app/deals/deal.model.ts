import { User } from '../auth/user.model'
import { Contact } from '../crm/contact.model'

export class Deal {
  readonly name: string | null
  readonly value: number | null
  readonly contact: Contact | null = null
  readonly createdByServiceId: number | null
  readonly createdByUserId: number | null
  readonly email: string | null
  readonly id: number | null
  readonly owner: User | null = null
  readonly pipeline: string | null
  readonly stageId: number | null

  constructor(data: Deal.API.IDeals) {
    this.name = data.name
    this.value = data.value
    this.createdByServiceId = data.created_by_service_id
    this.createdByUserId = data.created_by_user_id
    this.email = data.email
    this.id = data.id
    this.pipeline = data.pipeline
    this.stageId = data.stage_id

    if (data.contact) {
      this.contact = new Contact(data.contact)
    }
    if (data.owner) {
      this.owner = new User(data.owner)
    }
  }
}
