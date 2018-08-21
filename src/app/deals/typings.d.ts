declare namespace Deal {
  namespace API {
    interface IDeals {
      readonly name: string | null
      readonly value: number | null
      readonly contact: Crm.API.IContact | null
      readonly created_by_service_id: number | null
      readonly created_by_user_id: number | null
      readonly email: string | null
      readonly id: number | null
      readonly owner: Auth.API.IUser | null
      readonly pipeline: string | null
      readonly stage_id: number | null
    }

    interface IDealResponse {
      readonly links: {
        readonly prev?: string
        readonly next?: string
      }
      readonly data: {
        readonly deals: Array<IDeals>
      }
    }
  }
}
