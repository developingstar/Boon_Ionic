import { FormControl } from '@angular/forms'

import { User } from '../auth/user.model'
import { Group } from './group.model'

export type UserAction =
  | { readonly name: 'list' }
  | { readonly name: 'edit'; readonly group: Group }
  | { readonly name: 'new' }
  | { readonly name: 'update' }
  | { readonly name: 'add_user'; readonly user: User }
  | { readonly name: 'delete_user'; readonly user: User }

export type State =
  | { readonly name: 'list'; readonly groups: ReadonlyArray<Group> }
  | {
      readonly name: 'edit'
      readonly group_id: number
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
