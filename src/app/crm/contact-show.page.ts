import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'

import { User } from '../auth/user.model'
import { TabTypes } from '../show-tabs/tab-selector.component'
import { TabService } from '../show-tabs/tab.service'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { showToast } from '../utils/toast'
import { Contact } from './contact.model'
import { SalesService } from './sales.service'
import { UsersService } from './users.service'

@IonicPage({
  segment: 'contact/:id'
})
@Component({
  selector: 'contact-show.page',
  templateUrl: 'contact-show.page.html'
})
export class ContactShowPage implements OnInit {
  public leftTabs: TabTypes[] = ['Notes']
  public leftSelected: TabTypes = 'Notes'
  public contact: Contact
  public contactOwners: User[]
  public contactId: number
  public contactDataForm: FormGroup
  public state: 'view' | 'edit'

  constructor(
    private navController: NavController,
    private toastController: ToastController,
    private salesService: SalesService,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private tabService: TabService
  ) {}

  ngOnInit(): void {
    this.state = 'view'

    this.contactId = this.navParams.get('id')

    this.contactDataForm = this.formBuilder.group({
      contactOwner: new FormControl(),
      email: new FormControl('', emailValidator()),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', phoneNumberValidator())
    })

    this.salesService.contact(this.contactId).subscribe((res: Contact) => {
      this.contact = res
      if (this.contact) this.tabService.setContact(this.contact)
    })
  }

  enterEditMode(): void {
    this.state = 'edit'
    this.setFormData(this.contact)
    this.userService.getTeamMembers().subscribe((respsonse: User[]) => {
      this.contactOwners = respsonse
    })
  }

  updateContact(): void {
    const email = this.contactDataForm.get('email')!.value
    const firstName = this.contactDataForm.get('firstName')!.value
    const lastName = this.contactDataForm.get('lastName')!.value
    const phoneNumber = this.contactDataForm.get('phoneNumber')!.value
    const owner = this.contactDataForm.get('contactOwner')!.value
    const contactUpdate: Crm.API.IContactUpdate = {
      email: email ? email : '',
      first_name: firstName ? firstName : '',
      last_name: lastName ? lastName : '',
      owner_id: owner ? owner.id : '',
      phone_number: phoneNumber ? phoneNumber : ''
    }

    const subscription = this.salesService
      .updateContact(this.contactId, contactUpdate)
      .finally(() => {
        if (subscription) {
          subscription.unsubscribe()
        }
      })
      .subscribe(
        (res: Contact) => {
          showToast(this.toastController, 'Successfully updated contact')
          this.contact = res
        },
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

    this.state = 'view'
  }

  cancel(): void {
    this.state = 'view'
  }

  viewMode(): boolean {
    return this.state === 'view'
  }

  editMode(): boolean {
    return this.state === 'edit'
  }

  goToContacts(): void {
    if (this.navController.canGoBack()) {
      this.navController.pop()
    } else {
      this.navController.setRoot('CrmPage')
    }
  }

  setFormData(contactResponse: Contact): void {
    this.contactDataForm.patchValue({
      contactOwner: contactResponse.owner ? contactResponse.owner.name : '',
      email: contactResponse.email || '',
      firstName: contactResponse.firstName ? contactResponse.firstName : '',
      lastName: contactResponse.lastName ? contactResponse.lastName : '',
      phoneNumber: contactResponse.phoneNumber || ''
    })
  }
}
