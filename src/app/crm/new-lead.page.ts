import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormGroupName,
  Validators
} from '@angular/forms'
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { User } from '../auth/user.model'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { toastWarningDefaults } from '../utils/toast'
import { FieldDefinition } from './field-definition.model'
import { ISelectOption } from './field.component'
import { SalesService } from './sales.service'
import { Stage } from './stage.model'
import { UsersService } from './users.service'

const UnassignedUserId = ''

@IonicPage()
@Component({
  selector: 'new-lead-page',
  templateUrl: 'new-lead.page.html'
})
export class NewLeadPage {
  public newLeadForm: FormGroup
  public fields: Observable<Array<Crm.API.IFieldDefinition>>
  public owners: Observable<Array<ISelectOption>>
  public pipelines: Observable<Array<ISelectOption>>
  public stages: Observable<Array<ISelectOption>>

  constructor(
    private toastController: ToastController,
    private viewController: ViewController,
    private salesService: SalesService,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public currentUserService: CurrentUserService,
    public usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.currentUserService.details.subscribe((user: User) => {
      this.setForm(user)
    })
    this.setPipelines()
    this.setOwners()
    this.setFields()
  }

  setForm(user: User | undefined) {
    const userId = user ? user.id : undefined
    this.newLeadForm = this.formBuilder.group({
      email: ['', emailValidator()],
      owner_id: {
        disabled: !user || user.role !== 'admin',
        value: (userId || '').toString()
      },
      phone_number: ['', [phoneNumberValidator(), Validators.required]],
      pipeline_id: [],
      stage_id: []
    })
  }

  public create(formModel: any): void {
    const leadCreate = {
      ...this.buildLeadCreate(formModel)
    }
    const subscription = this.salesService
      .createLead(leadCreate)
      .finally(() => {
        if (subscription) {
          subscription.unsubscribe()
        }
      })
      .subscribe(
        () => this.viewController.dismiss(),
        (error: any) => {
          if (error.status === 422) {
            this.toastController
              .create({
                ...toastWarningDefaults,
                message: 'The form is invalid.'
              })
              .present()
          }
        }
      )
  }

  private buildLeadCreate(formModel: any): Crm.API.ILeadCreate {
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
      phone_number: formModel.phone_number,
      stage_id: parseInt(formModel.stage_id, 10),
      pipeline_id: parseInt(formModel.pipeline_id, 10)
    }
  }

  setFields(): void {
    this.fields = this.salesService.fields().map((fields) => {
      fields.map((field) => {
        this.newLeadForm.addControl(field.id.toString(), new FormControl(''))
      })
      return fields
    })
  }

  public cancel(): void {
    this.viewController.dismiss()
  }

  public setStages(pipeline_id: number | null): void {
    this.stages = this.salesService.stages(pipeline_id).map((stages) => {
      const options = stages.map((stage) => ({
        label: stage.name,
        value: stage.id.toString()
      }))
      this.newLeadForm.patchValue({ stage_id: options[0].value })
      return options
    })
  }

  setPipelines(): void {
    this.pipelines = this.salesService.pipelines().map((pipelines) => {
      this.setStages(pipelines[0].id)
      const options = pipelines.map((pipeline) => ({
        label: pipeline.name,
        value: pipeline.id.toString()
      }))
      this.newLeadForm.patchValue({ pipeline_id: options[0].value })
      return options
    })
  }

  setOwners(): void {
    this.owners = this.usersService.users().map((res) => {
      const unassigned = { label: 'not assigned', value: UnassignedUserId }
      const options = res.map((user) => ({
        label: user.name,
        value: user.id.toString()
      }))
      return [unassigned].concat(options)
    })
  }
}
