import { Service } from './service.model'

export type UserAction =
  | { readonly name: 'edit' }
  | { readonly name: 'update_service' }
  | { readonly name: 'list' }

export type State =
  | { readonly name: 'list'; readonly services: ReadonlyArray<Service> }
  | { readonly name: 'edit'; readonly service: Service }

export interface IState {
  readonly service?: Service
}

export const initialState: IState = {
  service: undefined
}

export const initialListState: State = {
  name: 'list',
  services: []
}
