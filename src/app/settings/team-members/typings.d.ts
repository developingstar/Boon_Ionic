declare namespace TeamSettings {
  type Role = 'admin' | 'sales_rep'

  interface ITeamMembers {
    readonly data: {
      readonly users: ReadonlyArray<Auth.API.IUser>
    }
  }

  interface ITeamMember {
    readonly data: {
      readonly user: Auth.API.IUser
    }
  }

  interface IPhoneNumber {
    readonly phone_number: string
  }

  interface IPhoneNumbers {
    readonly data: {
      readonly phone_numbers: ReadonlyArray<IPhoneNumber>
    }
  }
}
