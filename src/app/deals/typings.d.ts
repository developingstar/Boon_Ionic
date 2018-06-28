declare namespace Deal {
  namespace API {
    interface IDeal {
      readonly name: string | null
      readonly value: number | null
      readonly contact: Crm.API.ILead | null
      readonly created_by_service_id: number | null
      readonly created_by_user_id: number | null
      readonly id: number | null
      readonly owner: Auth.API.IUser | null
      readonly pipeline: string | null
      readonly stage_id: number | null
    }

    interface IDealsResponse {
      readonly links: {
        readonly prev?: string
        readonly next?: string
      }
      readonly data: {
        readonly deals: Array<IDeal>
      }
    }

    interface IDealResponse {
      data: {
        readonly deal: IDeal
      }
    }
  }
}
