import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, ModalController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
import { Group } from './group.model'
import {
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
    private readonly modalCtrl: ModalController,
    private readonly groupsService: GroupsService
  ) {
    super(initialState)
  }

  editGroup(group: Group): void {
    this.uiActions.next({ name: 'edit', group: group })
  }

  goBackToList(): void {
    this.uiActions.next({ name: 'list' })
  }

  newPipeline(): void {
    this.uiActions.next({ name: 'new' })
  }

  createPipeline(): void {
    this.uiActions.next({ name: 'create' })
  }

  updatePipeline(): void {
    this.uiActions.next({ name: 'update' })
  }

  get currentPipelineNameInput(): Observable<FormControl | undefined> {
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
    } else {
      return Observable.of(state)
    }
  }
}
