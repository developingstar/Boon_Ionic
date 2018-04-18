import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage } from 'ionic-angular'
import { Observable } from 'rxjs'

import { User } from '../auth/user.model'
import { UsersService } from '../crm/users.service'
import { ReactivePage } from '../utils/reactive-page'
import { Group } from './group.model'
import {
  IGroupData,
  initialState,
  State,
  UserAction
} from './groups.page.state'
import { GroupsService } from './groups.service'

@IonicPage({
  segment: 'settings/team/groups'
})
@Component({
  selector: 'groups-page',
  templateUrl: 'groups.page.html'
})
export class GroupsPage extends ReactivePage<State, UserAction> {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService
  ) {
    super(initialState)
  }

  newGroup(): void {
    this.uiActions.next({ name: 'new' })
  }

  editGroup(group: Group): void {
    this.uiActions.next({ name: 'edit', group: group })
  }

  goBackToList(): void {
    this.uiActions.next({ name: 'list' })
  }

  createGroup(): void {
    this.uiActions.next({ name: 'create' })
  }

  updateGroup(): void {
    this.uiActions.next({ name: 'update' })
  }

  addUser(user_id: number): void {
    this.uiActions.next({ name: 'add_user', user_id: user_id })
  }

  deleteUser(user: User): void {
    this.uiActions.next({ name: 'delete_user', user: user })
  }

  get usersList(): Observable<ReadonlyArray<User>> {
    return this.state.map((state) => {
      if (state.name === 'edit') {
        return state.users
      } else {
        return []
      }
    })
  }

  get currentGroupNameInput(): Observable<FormControl | undefined> {
    return this.state.map(
      (state) =>
        state.name === 'edit' || state.name === 'new'
          ? state.nameInput
          : undefined
    )
  }

  get formInvalid(): Observable<boolean> {
    return this.state.map(
      (state) =>
        (state.name === 'new' || state.name === 'edit') &&
        !state.nameInput.valid
    )
  }

  get name(): Observable<string> {
    return this.state.map((state) => state.name)
  }

  get groups(): Observable<ReadonlyArray<Group>> {
    return this.state.map((state) => {
      if (state.name === 'list') {
        return state.groups
      } else {
        return []
      }
    })
  }

  get currentGroupUsers(): Observable<ReadonlyArray<User>> {
    return this.state.map((state) => {
      if (state.name === 'edit') {
        return state.groupUsers
      } else {
        return []
      }
    })
  }

  get isNewAction(): Observable<boolean> {
    return this.name.map((name) => name === 'new')
  }

  get isEditAction(): Observable<boolean> {
    return this.name.map((name) => name === 'edit')
  }

  get isListAction(): Observable<boolean> {
    return this.name.map((name) => name === 'list')
  }

  get showForm(): Observable<boolean> {
    return this.name.map((name) => name === 'edit' || name === 'new')
  }

  protected initialAction(): UserAction {
    return { name: 'list' }
  }

  protected reduce(state: State, action: UserAction): Observable<State> {
    const listGroups = this.groupsService
      .groups()
      .map<ReadonlyArray<Group>, State>((groups) => ({
        groups: groups,
        name: 'list'
      }))

    if (action.name === 'list') {
      return listGroups
    } else if (action.name === 'new') {
      return Observable.of<State>({
        name: 'new',
        nameInput: new FormControl('', Validators.required)
      })
    } else if (action.name === 'create' && state.name === 'new') {
      return this.groupsService
        .createGroup(state.nameInput.value)
        .concatMap(() => listGroups)
    } else if (action.name === 'edit') {
      const newC = Observable.combineLatest(
        this.groupsService.groupUsers(action.group.id),
        this.usersService.users(),
        (groupUsers, users) => ({
          groupUsers: groupUsers,
          users: users
        })
      )

      return newC.map<IGroupData, State>((groupData: IGroupData) => ({
        groupUsers: groupData.groupUsers,
        group_id: action.group.id,
        name: 'edit',
        nameInput: new FormControl(action.group.name, Validators.required),
        users: groupData.users
      }))
    } else if (action.name === 'update' && state.name === 'edit') {
      return this.groupsService
        .updateGroup(state.group_id, state.nameInput.value)
        .map<Group, State>((group) => state)
    } else if (action.name === 'add_user' && state.name === 'edit') {
      const isAlreadyAdded =
        state.groupUsers.find((u) => u.id === action.user_id) !== undefined
      const user = state.users.find((u) => u.id === action.user_id)

      if (isAlreadyAdded || user === undefined) {
        return Observable.of(state)
      } else {
        return this.groupsService.addUser(state.group_id, action.user_id).map<
          {
            readonly data: {
              readonly message: string
            }
          },
          State
        >((response) => ({
          ...state,
          groupUsers: state.groupUsers.concat(user)
        }))
      }
    } else if (action.name === 'delete_user' && state.name === 'edit') {
      const userIndex = state.groupUsers.indexOf(action.user)
      return this.groupsService.deleteUser(state.group_id, action.user.id).map<
        {
          readonly data: {
            readonly message: string
          }
        },
        State
      >((response) => ({
        ...state,
        groupUsers: state.groupUsers.filter((user, index) => index !== userIndex)
      }))
    } else {
      return Observable.of(state)
    }
  }
}
