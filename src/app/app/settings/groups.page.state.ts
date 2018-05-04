import { FormControl } from '@angular/forms'

import { User } from '../auth/user.model'
import { Group } from './group.model'

export type UserAction =
  | { readonly name: 'list' }
  | { readonly name: 'new' }
  | { readonly name: 'create' }
  | { readonly name: 'edit'; readonly group: Group }
  | { readonly name: 'update' }
  | { readonly name: 'add_user'; readonly user_id: number }
  | { readonly name: 'delete_user'; readonly user: User }

export type State =
  | { readonly name: 'list'; readonly groups: ReadonlyArray<Group> }
  | {
      readonly name: 'edit'
      readonly groupId: number
      readonly nameInput: FormControl
      readonly groupUsers: ReadonlyArray<User>
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

export interface IGroupData {
  readonly users: ReadonlyArray<User>
  readonly groupUsers: ReadonlyArray<User>
}
