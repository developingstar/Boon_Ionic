declare namespace Auth {
  namespace API {
    type Role = 'admin' | 'sales_rep'

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

  interface IRolesAccess {
    pageAccess: IPageAccess
    navAccess: INavAccess
    functionalityAccess: IFunctionalityAccess
    [key: string]: IPageAccess | INavAccess | IFunctionalityAccess
  }

  interface IRoles {
    admin: IRolesAccess
    sales_rep: IRolesAccess
    [key: string]: IRolesAccess
  }

  interface IFunctionalityAccess {
    updateStage?: boolean
  }

  interface IPageAccess {
    AccountSettingsPage?: boolean
    DealsIndexPage?: boolean
    DealsShowPage?: boolean
    CrmPage?: boolean
    CustomFieldsPage?: boolean
    EmailTemplatePage?: boolean
    EmailTemplatesPage?: boolean
    GroupsPage?: boolean
    IntegrationPage?: boolean
    JourneyPage?: boolean
    JourneysPage?: boolean
    PipelinesPage?: boolean
    TeamMembersPage?: boolean
    TextTemplatePage?: boolean
    TextTemplatesPage?: boolean
  }

  // TODO: Text/Email will be renamed to templates in the near future
  interface INavAccess {
    Automation?: boolean
    Crm?: boolean
    Deals?: boolean
    Email?: boolean
    Settings?: boolean
    Text?: boolean
    [key: string]: boolean | undefined
  }
}
