import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { toastSuccessDefaults, toastWarningDefaults } from '../utils/toast'
import { ISelectOption } from './field.component'
import { Lead } from './lead.model'
import { initialState, IPageData, State, UserAction } from './lead.page.state'
import { Note } from './note.model'
import { SalesService } from './sales.service'
import { Stage } from './stage.model'
import { UsersService } from './users.service'

const UnassignedUserId = ''

@IonicPage({
  segment: 'lead/:id'
})
@Component({
  selector: 'lead-page',
  templateUrl: 'lead.page.html'
})
export class LeadPage implements OnDestroy, OnInit {
  public readonly fields: Observable<ReadonlyArray<Crm.API.IFieldDefinition>>
  public readonly owners: Observable<ReadonlyArray<ISelectOption>>
  public readonly stages: Observable<ReadonlyArray<Stage>>
  public notes: Observable<ReadonlyArray<Note>>
  public selectedNavItem: string
  public newNote: string
  public leadId: number
  public currentStageId: number
  public newStageId: number

  private readonly state: Observable<State>
  private readonly stateSubscription: Subscription
  private readonly uiActions: Subject<UserAction> = new Subject()

  constructor(
    private readonly navController: NavController,
    private readonly toastController: ToastController,
    private readonly formBuilder: FormBuilder,
    public readonly salesService: SalesService,
    navParams: NavParams,
    currentUserService: CurrentUserService,
    usersService: UsersService
  ) {
    this.fields = salesService.fields()
    const getRole = currentUserService.role()

    this.owners = getRole
      .switchMap((role) => {
        return role !== 'admin'
          ? currentUserService.details.map(
              (details) => (details ? [details] : [])
            )
          : usersService.users()
      })
      .map((users) => {
        const unassigned = { label: 'not assigned', value: UnassignedUserId }
        const options = users.map((user) => ({
          label: user.name,
          value: user.id.toString()
        }))
        return [unassigned].concat(options)
      })

    const leadId: number = navParams.get('id')
    const getLead = salesService.lead(leadId)
    this.notes = salesService.notes(leadId)
    this.leadId = leadId

    this.stages = getLead
      .switchMap((lead) => {
        return salesService.stage(lead.stageId).switchMap((stage) => {
          this.currentStageId = stage.id
          return salesService.stages(stage.pipelineId)
        })
      })
      .shareReplay(1)

    const loadPageData = Observable.combineLatest(
      this.fields,
      getLead,
      this.owners,
      getRole,
      this.stages,
      this.notes,
      (fields, lead, owners, role, stages, notes) => ({
        fields: fields,
        lead: lead,
        notes: notes,
        owners: owners,
        role: role,
        stages: stages
      })
    ).map<IPageData, State>((pageData) => ({
      data: pageData,
      formGroup: this.buildForm(pageData, false),
      mode: 'show'
    }))

    this.state = this.uiActions
      .mergeScan((state: State, action: UserAction) => {
        if (state.mode === 'init') {
          return loadPageData
        } else if (action === 'init') {
          return loadPageData
        } else if (action === 'edit') {
          if (state.mode === 'show') {
            return Observable.of<State>({
              data: state.data,
              formGroup: this.buildForm(state.data, true),
              mode: 'edit'
            })
          }
        } else if (action === 'show') {
          if (state.mode === 'edit') {
            return Observable.of<State>({
              data: state.data,
              formGroup: this.buildForm(state.data, false),
              mode: 'show'
            })
          }
        } else if (action.name === 'update') {
          if (state.mode === 'edit' || this.canUpdateStage()) {
            return salesService
              .updateLead(state.data.lead.id, action.leadUpdate)
              .map<Lead, State>((lead) => {
                const data = { ...state.data, lead: lead }
                this.currentStageId = lead.stageId
                if (action.leadUpdate.stage_id) this.stageUpdateSuccess()
                return {
                  data: data,
                  formGroup: this.buildForm(data, false),
                  mode: 'show'
                }
              })
          }
        } else if (action.name === 'create_note') {
          return salesService
            .createNote(this.leadId, action.newNote)
            .map<Note, State>((note) => {
              const data = {
                ...state.data,
                notes: state.data.notes.concat(note)
              }
              return {
                ...state,
                data: data
              }
            })
        }

        return Observable.of(state)
      }, initialState)
      .catch((error: any, observable: Observable<State>) => {
        if (error.status === 422) {
          this.toastController
            .create({
              ...toastWarningDefaults,
              message: 'The form is invalid.'
            })
            .present()
        }

        // return to the 'init' state
        return observable
      })
      .shareReplay(1)

    this.stateSubscription = this.state.subscribe()
  }

  ngOnInit(): void {
    this.uiActions.next('init')
    this.selectedNavItem = 'notes'
    this.newNote = ''
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  get lead(): Observable<Lead | undefined> {
    return this.state.map(
      (state) =>
        state.mode === 'show' || state.mode === 'edit'
          ? state.data.lead
          : undefined
    )
  }

  get formGroup(): Observable<FormGroup> {
    return this.state.map(
      (state) =>
        state.mode === 'show' || state.mode === 'edit'
          ? state.formGroup
          : new FormGroup({})
    )
  }

  get editMode(): Observable<boolean> {
    return this.state.map((state) => state.mode === 'edit')
  }

  get notesList(): Observable<ReadonlyArray<Note>> {
    return this.state.map((state) => {
      if (state.mode === 'show' || state.mode === 'edit') {
        return state.data.notes
      } else {
        return []
      }
    })
  }

  public goBack(): void {
    this.navController.setRoot('CrmPage')
  }

  public edit(): void {
    this.uiActions.next('edit')
  }

  public save(formModel: any): void {
    const leadUpdate = this.buildLeadUpdate(formModel)
    this.uiActions.next({ name: 'update', leadUpdate: leadUpdate })
  }

  public cancel(): void {
    this.uiActions.next('show')
  }

  public setNavItem(item: string): void {
    this.selectedNavItem = item
  }

  public addNote(): void {
    if (this.newNote.replace(/ /g, '') !== '') {
      this.uiActions.next({
        name: 'create_note',
        newNote: { content: this.newNote }
      })
      this.newNote = ''
    }
  }

  public isNoteEmpty(): boolean {
    return this.newNote.replace(/ /g, '') === '' ? true : false
  }
  public canUpdateStage(): boolean {
    return (
      this.newStageId !== undefined && this.currentStageId !== this.newStageId
    )
  }
  public updateStage(): void {
    const leadUpdate: Crm.API.ILeadUpdate = {
      stage_id: this.newStageId
    }
    this.uiActions.next({ name: 'update', leadUpdate: leadUpdate })
  }
  public onStageChange(event: any): void {
    this.newStageId = event
  }
  private stageUpdateSuccess(): void {
    this.toastController
      .create({
        ...toastSuccessDefaults,
        message: 'Lead updated successfully'
      })
      .present()
  }
  private buildForm(pageData: IPageData, editMode: boolean): FormGroup {
    const baseFields = {
      email: [
        { disabled: !editMode, value: pageData.lead.email },
        emailValidator()
      ],
      owner_id: {
        disabled: !editMode || pageData.role !== 'admin',
        value: pageData.lead.owner
          ? pageData.lead.owner.id.toString()
          : UnassignedUserId
      },
      phoneNumber: [
        { value: pageData.lead.phoneNumber, disabled: !editMode },
        [phoneNumberValidator(), Validators.required]
      ]
    }
    const formModel = pageData.fields.reduce((model, field) => {
      return {
        ...model,
        [field.id]: {
          disabled: !editMode,
          value: this.getFieldValue(field.id, pageData.lead)
        }
      }
    }, baseFields)

    return this.formBuilder.group(formModel)
  }

  private getFieldValue(fieldId: number, lead: Lead): string {
    const field = lead.fields.find((f) => f.id === fieldId)
    return field ? field.value : ''
  }

  private buildLeadUpdate(formModel: any): Crm.API.ILeadUpdate {
    return {
      email: formModel.email === '' ? null : formModel.email,
      fields: Object.keys(formModel)
        .map((key) => {
          return {
            id: parseInt(key, 10),
            value: formModel[key]
          }
        })
        .filter((field) => !isNaN(field.id) && field.value !== ''),
      owner_id:
        formModel.owner_id === UnassignedUserId
          ? null
          : parseInt(formModel.owner_id, 10),
      phone_number: formModel.phoneNumber
    }
  }
}
