import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { FieldDefinition } from '../crm/field-definition.model'
import { SalesService } from '../crm/sales.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { showToast } from '../utils/toast'
import { AlertService } from './alert.service'
import { initialState, State, UserAction } from './custom-fields.page.state'

@IonicPage({
  segment: 'settings/cms/custom-fields'
})
@Component({
  selector: 'custom-fields-page',
  templateUrl: 'custom-fields.page.html'
})
export class CustomFieldsPage extends ReactivePage<State, UserAction> {
  isChanged: boolean
  originalField: FieldDefinition

  constructor(
    public alertService: AlertService,
    private salesService: SalesService,
    private currentUserService: CurrentUserService,
    private readonly toastController: ToastController
  ) {
    super(initialState)
  }

  nameChanged(value: string): void {
    this.isChanged = this.originalField.name !== value ? true : false
  }

  ionViewCanLeave(): Promise<boolean> {
    if (this.isChanged)
      return this.alertService.showSaveConfirmDialog(
        this.handleYes,
        this.handleNo
      )
    else return Promise.resolve(true)
  }

  get showList(): Observable<boolean> {
    return this.state.map((state) => state.mode === 'list')
  }

  get showForm(): Observable<boolean> {
    return this.state.map(
      (state) => state.mode === 'new' || state.mode === 'edit'
    )
  }

  get fields(): Observable<ReadonlyArray<FieldDefinition>> {
    return this.state.map((state) => {
      if (state.mode === 'list') {
        return state.fields
      } else {
        return []
      }
    })
  }

  get isCreateMode(): Observable<boolean> {
    return this.state.map((state) => state.mode === 'new')
  }

  get isEditMode(): Observable<boolean> {
    return this.state.map((state) => state.mode === 'edit')
  }

  get formControl(): Observable<FormControl | undefined> {
    return this.state.map(
      (state) =>
        state.mode === 'new' || state.mode === 'edit'
          ? state.formControl
          : undefined
    )
  }

  get formInvalid(): Observable<boolean> {
    return this.state.map(
      (state) =>
        state.mode === 'new' || state.mode === 'edit'
          ? !state.formControl.valid
          : true
    )
  }

  goBackToList(): void {
    this.isChanged = false
    this.uiActions.next({ name: 'list' })
  }

  newField(): void {
    this.uiActions.next({ name: 'new' })
  }

  createField(): void {
    this.uiActions.next({ name: 'create' })
  }

  editField(field: FieldDefinition): void {
    this.originalField = new FieldDefinition({
      id: field.id,
      name: field.name
    })
    this.uiActions.next({ name: 'edit', field: field })
  }

  updateField(): void {
    this.uiActions.next({ name: 'update' })
  }

  createForm(field: FieldDefinition | undefined): FormControl {
    return new FormControl(field ? field.name : '', Validators.required)
  }

  protected initialAction(): UserAction {
    return { name: 'list' }
  }

  protected reduce(state: State, action: UserAction): Observable<State> {
    switch (action.name) {
      case 'list':
        return this.listFieldsState()
      case 'new':
        return Observable.of<State>({
          formControl: this.createForm(undefined),
          mode: 'new'
        })
      case 'create':
        if (state.mode === 'new') {
          const fieldCreate = {
            name: state.formControl.value
          }
          return this.salesService.createField(fieldCreate).concatMap(() => {
            showToast(
              this.toastController,
              'Created custom field successfully.'
            )
            this.isChanged = false
            return this.listFieldsState()
          })
        }

        return Observable.of(state)
      case 'edit':
        return Observable.of<State>({
          fieldId: action.field.id,
          formControl: this.createForm(action.field),
          mode: 'edit'
        })
      case 'update':
        if (state.mode === 'edit') {
          const fieldUpdate = {
            name: state.formControl.value
          }
          return this.salesService
            .updateField(state.fieldId, fieldUpdate)
            .concatMap(() => {
              showToast(
                this.toastController,
                'Updated custom field successfully.'
              )
              this.isChanged = false
              return this.listFieldsState()
            })
        }

        return Observable.of(state)
    }
  }

  private listFieldsState(): Observable<State> {
    return this.salesService
      .fields()
      .map<ReadonlyArray<FieldDefinition>, State>((fields) => ({
        fields: fields,
        mode: 'list'
      }))
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
    return pageAccess(role).CustomFieldsPage !== undefined
  }
}
