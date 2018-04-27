import {
  ensureInclusionOf,
  ensureNonEmptyString,
  ensureNumber
} from '../utils/validators'

export class User {
  readonly email: string
  readonly id: number
  readonly name: string
  readonly role: 'admin' | 'lead_owner'
  readonly avatar_url: string | null

  constructor(data: Auth.API.IUser) {
    this.email = ensureNonEmptyString(data.email)
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.role = ensureInclusionOf<Auth.API.Role>(data.role, [
      'admin',
      'lead_owner'
    ])
    this.avatar_url = data.avatar_url
  }
}
