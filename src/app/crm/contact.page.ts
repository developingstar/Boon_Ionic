import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { IPopoverResult } from '../popover/popover'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { showToast } from '../utils/toast'
import { Contact } from './contact.model'
import {
  initialState,
  IPageData,
  State,
  UserAction
} from './contact.page.state'
import { ISelectOption } from './field.component'
import { Note } from './note.model'
import { SalesService } from './sales.service'
import { Stage } from './stage.model'
import { UsersService } from './users.service'

const UnassignedUserId = ''

@IonicPage({
  segment: 'contact/:id'
})
@Component({
  selector: 'contact-page',
  templateUrl: 'contact.page.html'
})
export class ContactPage implements OnDestroy, OnInit {
  public readonly fields: Observable<ReadonlyArray<Crm.API.IFieldDefinition>>
  public readonly owners: Observable<ReadonlyArray<ISelectOption>>
  public stages: Observable<ReadonlyArray<Stage>>
  public notes: Observable<ReadonlyArray<Note>>
  public getContact: Observable<Contact>
  public selectedNavItem: string
  public newNote: string
  public contactId: number
  public currentStageId: number
  public newStageId: number

  private readonly state: Observable<State>
  private readonly stateSubscription: Subscription
  private readonly uiActions: Subject<UserAction> = new Subject()

  constructor(
    private readonly navController: NavController,
    private readonly toastController: ToastController,
    private modalController: ModalController,
    private readonly formBuilder: FormBuilder,
    public readonly salesService: SalesService,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
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

    this.contactId = navParams.get('id')
    this.getContact = salesService.contact(this.contactId)
    this.notes = salesService.notes(this.contactId)
    this.stages = this.setStages()

    const loadPageData = Observable.combineLatest(
      this.fields,
      this.getContact,
      this.owners,
      getRole,
      this.stages,
      this.notes,
      (fields, contact, owners, role, stages, notes) => ({
        contact: contact,
        fields: fields,
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
              .updateContact(state.data.contact.id, action.contactUpdate)
              .map<Contact, State>((contact) => {
                const data = { ...state.data, contact: contact }
                if (action.contactUpdate.stage_id) {
                  this.handleUpdateStages(data, action, contact)
                }
                return {
                  data: data,
                  formGroup: this.buildForm(data, false),
                  mode: 'show'
                }
              })
          }
        } else if (action.name === 'create_note') {
          return salesService
            .createNote(this.contactId, action.newNote)
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
          const errors = error.error.errors
          if (errors) {
            const detail = errors[0].detail
            const title = errors[0].title
            const pointers = errors[0].source.pointer.split('/')
            showToast(
              this.toastController,
              title + ': The ' + pointers[pointers.length - 1] + ' ' + detail,
              2000,
              false
            )
          } else {
            showToast(this.toastController, 'The form is invalid', 2000, false)
          }
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

  get contact(): Observable<Contact | undefined> {
    return this.state.map(
      (state) =>
        state.mode === 'show' || state.mode === 'edit'
          ? state.data.contact
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
    this.navController.pop()
  }

  public edit(): void {
    this.uiActions.next('edit')
  }

  public save(formModel: any): void {
    const contactUpdate = this.buildContactUpdate(formModel)
    this.uiActions.next({ name: 'update', contactUpdate: contactUpdate })
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
    showToast(this.toastController, 'Note added.', 2000)
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
    const contactUpdate: Crm.API.IContactUpdate = {
      stage_id: this.newStageId
    }
    this.uiActions.next({ name: 'update', contactUpdate: contactUpdate })
  }
  public onStageChange(event: any): void {
    this.newStageId = event
  }
  public more(event: any): void {
    const popover = this.popoverCtrl.create(
      'PopoverPage',
      { instanceName: 'contactMore' },
      { cssClass: 'boon-popover' }
    )
    popover.present({
      ev: event
    })
    popover.onDidDismiss((data: IPopoverResult) => {
      if (data && data.name === 'changePipeline') {
        this.changePipelineModal()
      }
    })
  }

  public changePipelineModal(): void {
    const modal = this.modalController.create(
      'AssignStageModalComponent',
      {
        action: { data: { stage_id: this.currentStageId } },
        isPipeline: true
      },
      { cssClass: 'assign-stage-modal-component' }
    )
    modal.present()
    modal.onDidDismiss((data: any) => {
      if (data && data.stage_id) {
        this.newStageId = data.stage_id
        this.updateStage()
      }
    })
  }

  private setStages(): any {
    return this.getContact
      .switchMap((contact) => {
        return this.salesService.stage(contact.stageId).switchMap((stage) => {
          this.currentStageId = stage.id
          return this.salesService.stages(stage.pipelineId)
        })
      })
      .shareReplay(1)
  }
  private handleUpdateStages(data: any, action: any, contact: Contact): void {
    this.currentStageId = contact.stageId
    const ids = data.stages.map((stage: Stage) => stage.id)
    if (ids.indexOf(this.currentStageId) === -1) {
      this.stages = this.setStages().map((stages: Stage[]) => {
        data.stages = stages
        return stages
      })
    }
    showToast(this.toastController, 'Contact updated successfully', 2000)
  }
  private buildForm(pageData: IPageData, editMode: boolean): FormGroup {
    const baseFields = {
      email: [
        { disabled: !editMode, value: pageData.contact.email },
        emailValidator()
      ],
      firstName: [{ disabled: !editMode, value: pageData.contact.firstName }],
      lastName: [{ disabled: !editMode, value: pageData.contact.lastName }],
      owner_id: {
        disabled: !editMode || pageData.role !== 'admin',
        value: pageData.contact.owner
          ? pageData.contact.owner.id.toString()
          : UnassignedUserId
      },
      phoneNumber: [
        { value: pageData.contact.phoneNumber, disabled: !editMode },
        [phoneNumberValidator(), Validators.required]
      ]
    }
    const formModel = pageData.fields.reduce((model, field) => {
      return {
        ...model,
        [field.id]: {
          disabled: !editMode,
          value: this.getFieldValue(field.id, pageData.contact)
        }
      }
    }, baseFields)

    return this.formBuilder.group(formModel)
  }

  private getFieldValue(fieldId: number, contact: Contact): string {
    const field = contact.fields.find((f) => f.id === fieldId)
    return field ? field.value : ''
  }

  private buildContactUpdate(formModel: any): Crm.API.IContactUpdate {
    showToast(this.toastController, 'Updated contact successfully.', 2000)
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
      first_name: formModel.firstName === '' ? null : formModel.firstName,
      last_name: formModel.lastName === '' ? null : formModel.lastName,
      owner_id:
        formModel.owner_id === UnassignedUserId
          ? null
          : parseInt(formModel.owner_id, 10),
      phone_number: formModel.phoneNumber
    }
  }
}
