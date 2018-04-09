import { FormControl } from '@angular/forms'

import { Service } from './service.model'

export type UserAction =
  | { readonly name: 'init' }
  | { readonly name: 'list' }

export type State =
  | { readonly mode: 'list'; readonly services: ReadonlyArray<Service> }
  | { readonly mode: 'init'; readonly service: Service }

export interface IState {
  readonly service?: Service
}

export const initialState: State = {
  mode: 'list',
  services: []
}
