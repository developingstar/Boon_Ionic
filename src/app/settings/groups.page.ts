import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { User } from '../auth/user.model'
import { UsersService } from '../crm/users.service'
import { ReactivePage } from '../utils/reactive-page'
import { Group } from './group.model'
import {
  initialState,
  State,
  UserAction
} from './groups.page.state'
import { GroupsService } from './groups.service'

type DistributionType = 'equal' | 'custom'
interface IDistributionType {
  readonly label: string
  readonly type: DistributionType
}

@IonicPage({
  segment: 'settings/team/groups'
})
@Component({
  selector: 'groups-page',
  templateUrl: 'groups.page.html'
})
export class GroupsPage extends ReactivePage<State, UserAction> {

  readonly distributions: ReadonlyArray<IDistributionType> = [
    { label: 'Equal', type: 'equal' },
    { label: 'Custom', type: 'custom' }
  ]
  private readonly distributionType: DistributionType = 'equal'
  private readonly users: Observable<ReadonlyArray<User>>
  private readonly userSubscription: Subscription

  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService
  ) {
    super(initialState)

    this.users = this.usersService
      .users()
      .map((users: ReadonlyArray<User>) => (users))
      .shareReplay(1)
    this.userSubscription = this.users.subscribe()
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
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
    this.users.subscribe((users) => {
      const newUser = users.find((user) => user.id === Number(user_id))
      if (newUser) {
        this.uiActions.next({ name: 'add_user', user: newUser})
      }
    })
  }

  deleteUser(user: User): void {
    this.uiActions.next({ name: 'delete_user', user: user})
  }

  get btnLabel(): string {
    return this.distributionType === 'equal' ? 'Equal' : '10%'
  }

  get usersList(): Observable<ReadonlyArray<User>> {
    return this.users
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
        return state.group_users
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

  get showList(): Observable<boolean> {
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
      return this.groupsService
        .users(action.group.id)
        .map<ReadonlyArray<User>, State>((users) => ({
          group_id: action.group.id,
          group_users: users,
          name: 'edit',
          nameInput: new FormControl(action.group.name, Validators.required)
        }))
    } else if (action.name === 'update' && state.name === 'edit') {
      return this.groupsService
        .updateGroup(state.group_id, state.nameInput.value)
        .map<Group, State>((group) => state)
    } else if (action.name === 'add_user' && state.name === 'edit') {
      const group_user = state.group_users.find((user) => user.id === Number(action.user.id))
      if (group_user) {
        return Observable.of(state)
      } else {
        return this.groupsService
          .addUser(state.group_id, action.user.id)
          .map<{
            readonly data: {
              readonly message: string
            }}, State>((response) => ({
              ...state,
              group_users: state.group_users.concat(action.user)
            }))
      }
    } else if (action.name === 'delete_user' && state.name === 'edit') {
      const index = state.group_users.indexOf(action.user)
      return this.groupsService
        .deleteUser(state.group_id, action.user.id)
        .map<{
          readonly data: {
            readonly message: string
          }}, State>((response) => ({
            ...state,
            group_users: state.group_users.filter((user, ind) => ind !== index)
          }))
    } else {
      return Observable.of(state)
    }
  }
}
