import { User } from '../auth/user.model'
import { Lead } from '../crm/lead.model'
import { ensureNumber } from '../utils/validators'

export class Deal {
  readonly name: string | null
  readonly value: number | null
  readonly contact: Lead | null = null
  readonly createdByServiceId: number | null
  readonly createdByUserId: number | null
  readonly id: number | null
  readonly owner: User | null = null
  readonly pipeline: string | null
  readonly stageId: number

  constructor(data: Deal.API.IDeal) {
    this.name = data.name
    this.value = data.value
    this.createdByServiceId = data.created_by_service_id
    this.createdByUserId = data.created_by_user_id
    this.id = data.id
    this.pipeline = data.pipeline
    this.stageId = ensureNumber(data.stage_id)

    if (data.contact) {
      this.contact = new Lead(data.contact)
    }

    if (data.owner) {
      this.owner = new User(data.owner)
    }
  }
}
