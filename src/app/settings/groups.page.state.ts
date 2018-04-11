import { FormControl } from '@angular/forms'

import { User } from '../auth/user.model'
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
      readonly users: ReadonlyArray<User>
    }
  | {
      readonly name: 'new'
      readonly nameInput: FormControl
    }

export const initialState: State = {
  groups: [],
  name: 'list'
}
