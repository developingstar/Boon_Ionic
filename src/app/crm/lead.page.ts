import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable, Subject } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { ISelectOption } from './field.component'
import { Lead } from './lead.model'
import { initialState, IPageData, State, UserAction } from './lead.page.state'
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
export class LeadPage implements OnInit {
  public readonly fields: Observable<ReadonlyArray<Crm.API.IFieldDefinition>>
  public readonly owners: Observable<ReadonlyArray<ISelectOption>>
  public readonly stages: Observable<ReadonlyArray<Stage>>

  private readonly state: Observable<State>
  private readonly uiActions: Subject<UserAction> = new Subject()

  constructor(
    private readonly navController: NavController,
    private readonly toastController: ToastController,
    private readonly formBuilder: FormBuilder,
    salesService: SalesService,
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

    this.stages = getLead
      .switchMap((lead) => {
        return salesService
          .stage(lead.stage_id)
          .switchMap((stage) => salesService.stages(stage.pipeline_id))
      })
      .shareReplay(1)

    const loadPageData = Observable.combineLatest(
      this.fields,
      getLead,
      this.owners,
      getRole,
      this.stages,
      (fields, lead, owners, role, stages) => ({
        fields: fields,
        lead: lead,
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
          if (state.mode === 'edit') {
            return salesService
              .updateLead(state.data.lead.id, action.leadUpdate)
              .map<Lead, State>((lead) => {
                const data = { ...state.data, lead: lead }
                return {
                  data: data,
                  formGroup: this.buildForm(data, false),
                  mode: 'show'
                }
              })
          }
        }

        return Observable.of(state)
      }, initialState)
      .catch((error: any, observable: Observable<State>) => {
        if (error.status === 422) {
          this.toastController
            .create({
              cssClass: 'boon-toast-warning',
              dismissOnPageChange: true,
              message: 'The form is invalid.',
              position: 'top',
              showCloseButton: true
            })
            .present()
        }

        // return to the 'init' state
        return observable
      })
      .shareReplay(1)
  }

  ngOnInit(): void {
    this.state.subscribe()
    this.uiActions.next('init')
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
      phone_number: [
        { value: pageData.lead.phone_number, disabled: !editMode },
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
      phone_number: formModel.phone_number
    }
  }
}
