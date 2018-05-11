declare namespace Auth {
  namespace API {
    type Role = 'admin' | 'lead_owner'

    interface IUser {
      readonly avatar_url: string | null
      readonly email: string
      readonly id: number
      readonly name: string
      readonly phone_number: string
      readonly password: string
      readonly role: Role
    }
  }
}
