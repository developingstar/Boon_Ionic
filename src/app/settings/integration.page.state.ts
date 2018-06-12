import { Service } from './service.model'

export type UserAction =
  | { readonly name: 'edit' }
  | { readonly name: 'update_service' }
  | { readonly name: 'create_service' }

export interface IState {
  readonly name: string
  readonly service?: Service
}

export const initialState: IState = {
  name: 'edit',
  service: undefined
}
