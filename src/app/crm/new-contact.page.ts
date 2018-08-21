import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, ToastController, ViewController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { User } from '../auth/user.model'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { showToast } from '../utils/toast'
import { ISelectOption } from './field.component'
import { SalesService } from './sales.service'
import { UsersService } from './users.service'

const UnassignedUserId = ''

@IonicPage()
@Component({
  selector: 'new-contact-page',
  templateUrl: 'new-contact.page.html'
})
export class NewContactPage {
  public newContactForm: FormGroup
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
      this.setOwners(user)
    })
    this.setPipelines()
    this.setFields()
  }

  setForm(user: User | undefined): void {
    const userId = user ? user.id : undefined
    this.newContactForm = this.formBuilder.group({
      email: ['', emailValidator()],
      firstName: [''],
      lastName: [''],
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
    const contactCreate = {
      ...this.buildContactCreate(formModel)
    }
    const subscription = this.salesService
      .createContact(contactCreate)
      .finally(() => {
        if (subscription) {
          subscription.unsubscribe()
        }
      })
      .subscribe(
        () => this.viewController.dismiss(),
        (error: any) => {
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
              showToast(
                this.toastController,
                'The form is invalid',
                2000,
                false
              )
            }
          }
        }
      )
  }

  public setFields(): void {
    this.fields = this.salesService.fields().map((fields) => {
      fields.map((field) => {
        this.newContactForm.addControl(field.id.toString(), new FormControl(''))
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
      this.newContactForm.patchValue({ stageId: options[0].value })
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
      this.newContactForm.patchValue({ pipelineId: options[0].value })
      return options
    })
  }
  public setOwners(user: User): void {
    if (user.role !== 'admin') {
      const options = [
        {
          label: user.name,
          value: user.id.toString()
        }
      ]
      this.owners = Observable.of(options)
      this.newContactForm.patchValue({ owner_id: options[0].value })
    } else {
      this.owners = this.usersService.users().map((users: User[]) => {
        const unassigned = { label: 'not assigned', value: UnassignedUserId }
        const options = users.map((admin: User) => ({
          label: admin.name,
          value: admin.id.toString()
        }))
        return [unassigned].concat(options)
      })
    }
  }

  private buildContactCreate(formModel: any): Crm.API.IContactCreate {
    showToast(this.toastController, 'Contact created successfully.')
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
      first_name: formModel.firstName,
      last_name: formModel.lastName,
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
