import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { AlertController, IonicPage, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { User } from '../auth/user.model'
import { UsersService } from '../crm/users.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { showToast } from '../utils/toast'
import { AlertService } from './alert.service'
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
  readonly userID: number
  isChanged: boolean
  originalName: string
  selectedUser: User

  constructor(
    public alertService: AlertService,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private currentUserService: CurrentUserService,
    private readonly toastController: ToastController,
    public alertCtrl: AlertController
  ) {
    super(initialState)
  }

  ionViewCanLeave(): Promise<boolean> {
    if (this.isChanged)
      return this.alertService.showSaveConfirmDialog(
        this.handleYes,
        this.handleNo
      )
    else return Promise.resolve(true)
  }

  nameChanged(value: string): void {
    this.isChanged = this.originalName !== value ? true : false
  }

  newGroup(): void {
    this.originalName = ''
    this.uiActions.next({ name: 'new' })
  }

  editGroup(group: Group): void {
    this.originalName = group.name
    this.uiActions.next({ name: 'edit', group: group })
  }

  goBackToList(): void {
    this.isChanged = false
    this.uiActions.next({ name: 'list' })
  }

  createGroup(): void {
    this.uiActions.next({ name: 'create' })
  }

  updateGroup(): void {
    this.uiActions.next({ name: 'update' })
  }

  addUser(): void {
    this.uiActions.next({ name: 'add_user', user_id: this.userID })
  }

  deleteUser(user: User): void {
    this.selectedUser = user
    this.alertService
      .showRemoveConfirmDialog(
        'Do you really want to remove this user?',
        this.handleYes,
        this.handleNo
      )
      .then((val: boolean) => {
        if (val === true) {
          this.uiActions.next({ name: 'delete_user', user: this.selectedUser })
        }
      })
  }

  get usersList(): Observable<ReadonlyArray<User>> {
    return this.state.map((state) => {
      if (state.name === 'edit') {
        const users = state.users.filter((user) => {
          return !(state.groupUsers.find((u) => u.id === user.id) !== undefined)
        })
        return users
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
        .createGroup({ name: state.nameInput.value })
        .concatMap(() => {
          showToast(this.toastController, 'Created new group successfully.')
          this.isChanged = false
          return listGroups
        })
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
        groupId: action.group.id,
        groupUsers: groupData.groupUsers,
        name: 'edit',
        nameInput: new FormControl(action.group.name, Validators.required),
        users: groupData.users
      }))
    } else if (action.name === 'update' && state.name === 'edit') {
      return this.groupsService
        .updateGroup(state.groupId, { name: state.nameInput.value })
        .map<Group, State>((group) => {
          this.isChanged = false
          this.originalName = group.name
          showToast(this.toastController, 'Updated group name successfully.')
          return state
        })
    } else if (action.name === 'add_user' && state.name === 'edit') {
      const user = state.users.find((u) => u.id === Number(action.user_id))

      if (user === undefined) {
        return Observable.of(state)
      } else {
        return this.groupsService.addUser(state.groupId, action.user_id).map<
          {
            readonly data: {
              readonly message: string
            }
          },
          State
        >((response) => {
          showToast(this.toastController, 'Added user successfully.')
          return {
            ...state,
            groupUsers: state.groupUsers.concat(user)
          }
        })
      }
    } else if (action.name === 'delete_user' && state.name === 'edit') {
      const userIndex = state.groupUsers.indexOf(action.user)
      return this.groupsService.deleteUser(state.groupId, action.user.id).map<
        {
          readonly data: {
            readonly message: string
          }
        },
        State
      >((response) => {
        showToast(this.toastController, 'Removed user successfully.')
        return {
          ...state,
          groupUsers: state.groupUsers.filter(
            (user, index) => index !== userIndex
          )
        }
      })
    } else {
      return Observable.of(state)
    }
  }

  private handleYes(): boolean {
    return true
  }

  private handleNo(): boolean {
    return false
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).GroupsPage !== undefined
  }
}
