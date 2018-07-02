import { HttpParams } from '@angular/common/http'
import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { IHttpRequestOptions } from '../api/http-request-options'
import { PaginatedList } from '../api/paginated-list'
import { CurrentUserService } from '../auth/current-user.service'
import { Pipeline } from '../crm/pipeline.model'
import { SalesService } from '../crm/sales.service'
import { Stage } from '../crm/stage.model'
import { pageAccess } from '../utils/app-access'
import { Deal } from './deal.model'
import { DealsService } from './deals.service'

@IonicPage({
  segment: 'deals'
})
@Component({
  selector: 'deals-index-page',
  templateUrl: 'deals-index.page.html'
})
export class DealsIndexPage {
  public pageData: PaginatedList<Deal>
  public pipelines: Pipeline[]
  public stages: Stage[]
  public allStages: Stage[]
  public deals: any
  public count: number | undefined
  public owner: any
  public selected: any = 'All Deals'
  public httpParams: HttpParams = new HttpParams()

  public pageState: 'All Deals' | 'Pipeline Selected'
  public sortList = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'owner.email' },
    { label: 'Pipeline', value: 'pipelineId' },
    { label: 'Stage', value: 'stageId' },
    { label: 'Deal Value', value: 'value' },
    { label: 'Deal Owner', value: 'owner.name' }
  ]

  constructor(
    private dealsService: DealsService,
    private currentUserService: CurrentUserService,
    private navController: NavController,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.getDeals()
    this.getPipelines()
    this.getStages()
    this.pageState = 'All Deals'
  }

  getDeals(url?: any): void {
    const options: IHttpRequestOptions = {
      params: this.httpParams,
      url: url || null
    }
    this.dealsService.deals(options).subscribe((res) => {
      this.pageData = res
      this.deals = this.pageData.items
      this.count = this.pageData.totalCount
    })
  }

  getPipelines(): void {
    this.dealsService.pipelines().subscribe((res) => {
      this.pipelines = res
      this.pipelines.unshift({ name: 'All Deals', id: -1, stageOrder: [] })
    })
  }

  getStages(): void {
    this.salesService.stages().subscribe((stages) => {
      this.allStages = stages
    })
  }

  getPipelineDeals(): void {
    this.httpParams = this.selected.id
      ? this.buildParams(this.httpParams, 'pipeline_id', this.selected.id)
      : new HttpParams()
    const options: IHttpRequestOptions = {
      params: this.httpParams,
      url: null
    }
    this.dealsService.deals(options).subscribe((res) => {
      this.pageData = res
      this.deals = this.pageData.items
    })
  }

  getPipelineStages(): void {
    if (this.selected.id === -1) {
      this.selected.id = undefined
    }
    this.salesService.stages(this.selected.id).subscribe((res) => {
      this.stages = res
      this.pageState = this.selected.name
      if (this.pageState !== 'All Deals') {
        this.pageState = 'Pipeline Selected'
      }
    })
  }

  public onSelection(): void {
    this.getPipelineDeals()
    this.getPipelineStages()
  }

  isAllDeals(): boolean {
    return this.pageState === 'All Deals'
  }

  public onSelect(stage: number | undefined): void {
    const options: IHttpRequestOptions = {
      params: this.buildParams(this.httpParams, 'stage_id', stage),
      url: null
    }
    this.dealsService.deals(options).subscribe((res) => {
      this.pageData = res
      this.deals = this.pageData.items
    })
  }

  buildParams(
    params: HttpParams,
    type: string,
    value: number | undefined
  ): HttpParams {
    if (value) return params.set(type, `${value}`)
    else return params.delete(type)
  }

  public goToNext(): void {
    this.getDeals(this.pageData.nextPageLink)
  }

  public goToPrev(): void {
    this.getDeals(this.pageData.prevPageLink)
  }

  public showDeal(deal: Deal): void {
    this.navController.push('DealsShowPage', { id: deal.id })
  }

  public newDeal(): void {
    // this.uiActions.next('newDeal')
  }

  public findStage(stageId: number): Stage | undefined {
    return this.allStages
      ? this.allStages.find((stage) => stage.id === stageId)
      : undefined
  }

  public getStageName(stageId: number): string | undefined {
    const stage = this.findStage(stageId)
    return stage ? stage.name : undefined
  }

  public findPipeline(stageId: number): Pipeline | undefined {
    return this.pipelines
      ? this.pipelines.find((pipeline) => {
          const stage = this.findStage(stageId)
          return stage ? pipeline.id === stage.pipelineId : false
        })
      : undefined
  }

  public getPipelineName(stageId: number): string | undefined {
    const pipeline = this.findPipeline(stageId)
    return pipeline ? pipeline.name : undefined
  }
  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).DealsIndexPage !== undefined
  }
}
