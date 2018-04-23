declare namespace Auth {
  namespace API {
    type Role = 'admin' | 'lead_owner'

    interface IUser {
      readonly email: string
      readonly id: number
      readonly name: string
      readonly role: Role
    }
  }
}
