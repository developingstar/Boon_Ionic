import { User } from '../auth/user.model'
import { Contact } from '../crm/contact.model'
import { ensureNumber } from '../utils/validators'

export class Deal {
  name: string | null
  value: number | null
  contact: Contact | null = null
  createdByServiceId: number | null
  createdByUserId: number | null
  id: number | null
  owner: User | null = null
  pipeline: string | null
  stageId: number

  constructor(data: Deal.API.IDeal) {
    this.name = data.name
    this.value = data.value
    this.createdByServiceId = data.created_by_service_id
    this.createdByUserId = data.created_by_user_id
    this.id = data.id
    this.pipeline = data.pipeline
    this.stageId = ensureNumber(data.stage_id)
    if (data.contact) {
      this.contact = new Contact(data.contact)
    }

    // if (data.owner) {
    //   this.owner = new User(data.owner)
    // }
  }
}
