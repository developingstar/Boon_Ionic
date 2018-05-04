import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, ToastController, ViewController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { User } from '../auth/user.model'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { toastWarningDefaults } from '../utils/toast'
import { ISelectOption } from './field.component'
import { SalesService } from './sales.service'
import { UsersService } from './users.service'

const UnassignedUserId = ''

@IonicPage()
@Component({
  selector: 'new-lead-page',
  templateUrl: 'new-lead.page.html'
})
export class NewLeadPage {
  public newLeadForm: FormGroup
  public fields: Observable<Crm.API.IFieldDefinition[]>
  public owners: Observable<ISelectOption[]>
  public pipelines: Observable<ISelectOption[]>
  public stages: Observable<ISelectOption[]>

  constructor(
    private toastController: ToastController,
    private viewController: ViewController,
    private salesService: SalesService,
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

  setForm(user: User | undefined): void {
    const userId = user ? user.id : undefined
    this.newLeadForm = this.formBuilder.group({
      email: ['', emailValidator()],
      owner_id: {
        disabled: !user || user.role !== 'admin',
        value: (userId || '').toString()
      },
      phoneNumber: ['', [phoneNumberValidator(), Validators.required]],
      pipelineId: [],
      stageId: []
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

  public setFields(): void {
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

  public setStages(pipelineId: number | null): void {
    this.stages = this.salesService.stages(pipelineId).map((stages) => {
      const options = stages.map((stage) => ({
        label: stage.name,
        value: stage.id.toString()
      }))
      this.newLeadForm.patchValue({ stageId: options[0].value })
      return options
    })
  }

  public setPipelines(): void {
    this.pipelines = this.salesService.pipelines().map((pipelines) => {
      this.setStages(pipelines[0].id)
      const options = pipelines.map((pipeline) => ({
        label: pipeline.name,
        value: pipeline.id.toString()
      }))
      this.newLeadForm.patchValue({ pipelineId: options[0].value })
      return options
    })
  }

  public setOwners(): void {
    this.owners = this.usersService.users().map((users: User[]) => {
      const unassigned = { label: 'not assigned', value: UnassignedUserId }
      const options = users.map((user: User) => ({
        label: user.name,
        value: user.id.toString()
      }))
      return [unassigned].concat(options)
    })
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
      phone_number: formModel.phoneNumber,
      pipeline_id: parseInt(formModel.pipelineId, 10),
      stage_id: parseInt(formModel.stageId, 10)
    }
  }
}
