import { FormControl } from '@angular/forms'

import { Service } from './service.model'

export type UserAction =
  | { readonly name: 'create' }
  | { readonly name: 'list' }
  | { readonly name: 'new' }
  | { readonly name: 'update' }
  | { readonly name: 'edit'; readonly service: Service }

export type State =
  | { readonly mode: 'list'; readonly services: ReadonlyArray<Service> }
  | {
      readonly mode: 'edit'
      readonly nameInput: FormControl
      readonly service: Service
    }
  | {
      readonly mode: 'new'
      readonly nameInput: FormControl
    }

export const initialState: State = {
  mode: 'list',
  services: []
}
