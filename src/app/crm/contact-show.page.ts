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
import { Lead } from './lead.model'
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
  public contact: Lead
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

    this.salesService.lead(this.contactId).subscribe((res: Lead) => {
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

  updateLead(): void {
    const email = this.contactDataForm.get('email')!.value
    const firstName = this.contactDataForm.get('firstName')!.value
    const lastName = this.contactDataForm.get('lastName')!.value
    const phoneNumber = this.contactDataForm.get('phoneNumber')!.value
    const owner = this.contactDataForm.get('contactOwner')!.value
    const contactUpdate: Crm.API.ILeadUpdate = {
      email: email ? email : '',
      first_name: firstName ? firstName : '',
      last_name: lastName ? lastName : '',
      owner_id: owner ? owner.id : '',
      phone_number: phoneNumber ? phoneNumber : ''
    }

    this.salesService
      .updateLead(this.contactId, contactUpdate)
      .subscribe((res: Lead) => {
        showToast(this.toastController, 'Successfully updated contact')
        this.contact = res
      })

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

  setFormData(leadResponse: Lead): void {
    this.contactDataForm.patchValue({
      contactOwner: leadResponse.owner ? leadResponse.owner.name : '',
      email: leadResponse.email || '',
      firstName: leadResponse.firstName ? leadResponse.firstName : '',
      lastName: leadResponse.lastName ? leadResponse.lastName : '',
      phoneNumber: leadResponse.phoneNumber || ''
    })
  }
}
