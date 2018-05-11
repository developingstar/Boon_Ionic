declare namespace TeamSettings {
  type Role = 'admin' | 'lead_owner'

  interface ISomething {
    readonly avatar_url: string
    readonly email: string
    readonly id: number
    readonly name: string
    readonly phone_number: string
    readonly password: string
    readonly role: Role
  }

  interface ITeamMembers {
    readonly data: {
      readonly users: ReadonlyArray<ISomething>
    }
  }

  interface ITeamMember {
    readonly data: {
      readonly user: ISomething
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
