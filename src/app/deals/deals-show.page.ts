import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { Field } from '../crm/field.model'
import { Lead } from '../crm/lead.model'
import { SalesService } from '../crm/sales.service'
import { Stage } from '../crm/stage.model'
import { DealsService } from '../deals/deals.service'
import { TabTypes } from '../show-tabs/tab-selector.component'
import { pageAccess } from '../utils/app-access'
import { emailValidator, phoneNumberValidator } from '../utils/form-validators'
import { showToast } from '../utils/toast'
import { Deal } from './deal.model'

@IonicPage({
  segment: 'deals/:id'
})
@Component({
  selector: 'deals-show-page',
  templateUrl: 'deals-show.page.html'
})
export class DealsShowPage implements OnInit {
  public leftTabs: TabTypes[] = ['Deals', 'Notes', 'Activity']
  public rightTabs: TabTypes[] = ['Texting', 'Email']
  public leftSelected: TabTypes = 'Deals'
  public rightSelected: TabTypes = 'Texting'
  public currentDeal: Deal
  public contactTest: Lead
  public state: 'view' | 'edit'
  public fieldsTest: ReadonlyArray<Field>
  public dealDataForm: FormGroup
  public getDeal: Observable<Deal>
  public currentStageId: number
  public newStageId: number
  public stages: Observable<ReadonlyArray<Stage>>

  constructor(
    private currentUserService: CurrentUserService,
    private dealsService: DealsService,
    public  salesService: SalesService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private navParams: NavParams,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.state = 'view'

    this.dealDataForm = this.formBuilder.group({
      email: new FormControl('', emailValidator()),
      name: new FormControl(),
      phoneNumber: new FormControl('', phoneNumberValidator()),
      referralOwner: new FormControl(),
      value: new FormControl()
    })

    const dealId = this.navParams.get('id')
    this.getDeal = this.dealsService.getDeal(dealId)
    this.getDeal.subscribe((res: Deal) => {
      this.currentDeal = res
      this.stages = this.salesService.stage(this.currentDeal.stageId).switchMap((stage) => {
        this.currentStageId = stage.id
        return this.salesService.stages(stage.pipelineId)
      })
    })
  }

  enterEditMode(): void {
    this.state = 'edit'
    this.setFormData(this.currentDeal)
  }

  updateDeal(): void {
    const formValueInput = this.dealDataForm.get('value')
    const value = this.state === 'edit' ? (formValueInput ? formValueInput.value : 0) : this.currentDeal.value
    const dealUpdate = {
      stage_id: this.newStageId,
      value: value ? parseInt(value, 0) : 0
    }
    // may also need to update the concact here
    this.dealsService
      .updateDeal(this.currentDeal.id, dealUpdate)
      .subscribe((res: Deal) => {
        showToast(this.toastController, 'Successfully updated the deal')
        this.currentDeal = res
        this.setFormData(res)
      })

    this.state = 'view'
  }

  setFormData(dealResponse: Deal): void {
    this.dealDataForm.patchValue({
      email: dealResponse.contact ? dealResponse.contact.email : '',
      name: dealResponse.contact ? dealResponse.contact.name : '',
      phoneNumber: dealResponse.contact ? dealResponse.contact.phoneNumber : '',
      referralOwner: dealResponse.owner ? dealResponse.owner.name : '',
      value: dealResponse.value || ''
    })
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

  goToDeals(): void {
    this.navController.pop()
  }

  public onStageChange(event: any): void {
    this.newStageId = event
  }

  get deal(): Observable<Deal | undefined> {
    return this.getDeal
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).DealsShowPage !== undefined
  }
}
