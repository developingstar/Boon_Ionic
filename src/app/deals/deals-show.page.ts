import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { SalesService } from '../crm/sales.service'
import { Stage } from '../crm/stage.model'
import { DealsService } from '../deals/deals.service'
import { TabTypes } from '../show-tabs/tab-selector.component'
import { TabService } from '../show-tabs/tab.service'
import { pageAccess } from '../utils/app-access'
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
  public leftTabs: TabTypes[] = ['Notes']
  public leftSelected: TabTypes = 'Notes'
  public deal: Deal
  public state: 'view' | 'edit'
  public dealForm: FormGroup
  public stages: Observable<Stage[]>

  constructor(
    private currentUserService: CurrentUserService,
    private dealsService: DealsService,
    public salesService: SalesService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private navParams: NavParams,
    private toastController: ToastController,
    private modalController: ModalController,
    private tabService: TabService
  ) {}

  ngOnInit(): void {
    this.state = 'view'

    this.dealForm = this.formBuilder.group({
      name: new FormControl(),
      value: new FormControl()
    })
    const dealId = this.navParams.get('id')
    this.dealsService.getDeal(dealId).subscribe(async (res: Deal) => {
      this.deal = res
      if (this.deal) this.tabService.setDeal(this.deal)
      if (this.deal.contact) this.tabService.setContact(this.deal.contact)
      this.setPipelineSelect()
    })
  }

  async setPipelineSelect(): Promise<void> {
    const stage = await this.salesService.stage(this.deal.stageId).toPromise()
    this.stages = this.salesService.stages(stage.pipelineId)
  }

  enterEditMode(): void {
    this.state = 'edit'
    this.setFormData(this.deal)
  }

  updateDeal(stageId?: number): void {
    const name = this.dealForm.get('name')!.value
    const value = this.dealForm.get('value')!.value
    const dealUpdate = {
      name: !!name ? name : this.deal.name,
      stage_id: !!stageId ? stageId : this.deal.stageId,
      value: !!value ? parseInt(value, 0) : this.deal.value
    }
    // may also need to update the concact here
    this.dealsService
      .updateDeal(this.deal.id, dealUpdate)
      .subscribe((res: Deal) => {
        showToast(this.toastController, 'Successfully updated the deal')
        this.deal = res
        this.setFormData(res)
        this.setPipelineSelect()
      })

    this.state = 'view'
  }

  public changePipelineModal(): void {
    const modal = this.modalController.create(
      'AssignStageModalComponent',
      {
        action: { data: { stage_id: this.deal.stageId } },
        isPipeline: true
      },
      { cssClass: 'assign-stage-modal-component' }
    )
    modal.present()
    modal.onDidDismiss((data: any) => {
      if (data && data.stage_id) {
        this.updateDeal(data.stage_id)
      }
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

  setFormData(deal: Deal): void {
    this.dealForm.patchValue({
      name: deal ? deal.name : '',
      value: deal.value || ''
    })
  }

  onStageSelect(stageId: number): void {
    if (stageId) this.deal.stageId = stageId
  }

  goBack(): void {
    if (this.navController.canGoBack()) {
      this.navController.pop()
    } else {
      this.navController.setRoot('DealsIndexPage')
    }
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).DealsShowPage !== undefined
  }
}
