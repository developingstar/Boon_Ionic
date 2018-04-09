import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { User } from '../auth/user.model'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { FieldDefinition } from './field-definition.model'
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
  public readonly formGroup: Observable<FormGroup>
  public readonly fields: Observable<ReadonlyArray<Crm.API.IFieldDefinition>>
  public readonly owners: Observable<ReadonlyArray<ISelectOption>>

  constructor(
    private readonly toastController: ToastController,
    private readonly viewController: ViewController,
    private readonly salesService: SalesService,
    private readonly navParams: NavParams,
    formBuilder: FormBuilder,
    currentUserService: CurrentUserService,
    usersService: UsersService
  ) {
    this.fields = salesService.fields()

    this.owners = currentUserService.details
      .switchMap(
        (user) =>
          user
            ? user.role === 'admin'
              ? usersService.users()
              : Observable.of([user])
            : Observable.of([])
      )
      .map((users) => {
        const unassigned = { label: 'not assigned', value: UnassignedUserId }
        const options = users.map((user) => ({
          label: user.name,
          value: user.id.toString()
        }))
        return [unassigned].concat(options)
      })

    this.formGroup = Observable.combineLatest(
      this.fields,
      currentUserService.details,
      (fields, user) => this.buildForm(formBuilder, fields, user)
    )
  }

  public create(formModel: any): void {
    const leadCreate = {
      ...this.buildLeadCreate(formModel),
      stage_id: this.navParams.get('stageId')
    }
    this.salesService.createLead(leadCreate).subscribe(
      () => this.viewController.dismiss(),
      (error: any) => {
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
      }
    )
  }

  public cancel(): void {
    this.viewController.dismiss()
  }

  private buildForm(
    formBuilder: FormBuilder,
    fields: ReadonlyArray<FieldDefinition>,
    user: User | undefined
  ): FormGroup {
    const userId = user ? user.id : undefined
    const baseFields = {
      email: ['', emailValidator()],
      owner_id: {
        disabled: !user || user.role !== 'admin',
        value: (userId || UnassignedUserId).toString()
      },
      phone_number: ['', [phoneNumberValidator(), Validators.required]]
    }
    const formModel = fields.reduce((model, field) => {
      return {
        ...model,
        [field.id]: ''
      }
    }, baseFields)

    return formBuilder.group(formModel)
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
      phone_number: formModel.phone_number
    }
  }
}
