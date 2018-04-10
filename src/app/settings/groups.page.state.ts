import { FormControl } from '@angular/forms'

import { Group } from './group.model'

export type UserAction =
  | { readonly name: 'create' }
  | { readonly name: 'list' }
  | { readonly name: 'new' }
  | { readonly name: 'update' }
  | { readonly name: 'edit'; readonly group: Group }

export type State =
  | { readonly name: 'list'; readonly groups: ReadonlyArray<Group> }
  | {
      readonly name: 'edit'
      readonly nameInput: FormControl
      readonly pipeline: Group
    }
  | {
      readonly name: 'new'
      readonly nameInput: FormControl
    }

export const initialState: State = {
  groups: [],
  name: 'list'
}
