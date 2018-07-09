import {
  ensureInclusionOf,
  ensureNonEmptyString,
  ensureNumber
} from '../utils/validators'

export class User {
  readonly email: string
  readonly id: number
  readonly name: string
  readonly password: string
  readonly phoneNumber: string
  readonly role: 'admin' | 'sales_rep'
  readonly avatarUrl: string | null

  constructor(data: Auth.API.IUser) {
    this.email = ensureNonEmptyString(data.email)
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.password = data.password || ''
    this.phoneNumber = data.phone_number || ''
    this.role = ensureInclusionOf<Auth.API.Role>(data.role, [
      'admin',
      'sales_rep'
    ])
    this.avatarUrl = data.avatar_url || null
  }

  public toApiRepresentation(): Auth.API.IUser {
    return {
      avatar_url: this.avatarUrl,
      email: this.email,
      id: this.id,
      name: this.name,
      password: this.password,
      phone_number: this.phoneNumber,
      role: this.role
    }
  }
}
