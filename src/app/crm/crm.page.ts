import { HttpParams } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { IonicPage, ModalController, NavController } from 'ionic-angular'
import { Observable, Subject } from 'rxjs'

import { IHttpRequestOptions } from './../api/http-request-options'
import {
  FilterType,
  initialState,
  ISetFilter,
  IState,
  UserAction
} from './crm.page.state'
import { Lead } from './lead.model'
import { Pipeline } from './pipeline.model'
import { SalesService } from './sales.service'
import { Stage } from './stage.model'

@IonicPage({
  segment: 'crm'
})
@Component({
  selector: 'crm-page',
  templateUrl: 'crm.page.html'
})
export class CrmPage implements OnInit {
  readonly pipelines: Observable<ReadonlyArray<Pipeline>>

  private readonly stages: Observable<ReadonlyArray<Stage>>
  private readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()

  constructor(
    private readonly salesService: SalesService,
    private readonly modalController: ModalController,
    private readonly navController: NavController
  ) {
    this.state = this.uiActions
      .mergeScan((state: IState, action: UserAction) => {
        if (action === 'newLead') {
          this.showNewLeadModal(state.stageId)
          return Observable.of(state)
        } else {
          const newRequestOptions = this.actionToRequestOptions(state, action)
          return this.salesService.leads(newRequestOptions).map((newLeads) => ({
            leads: newLeads,
            pipelineId: this.nextPipelineId(state, action),
            requestOptions: newRequestOptions,
            stageId: this.nextStageId(state, action)
          }))
        }
      }, initialState)
      .shareReplay(1)

    this.pipelines = this.salesService.pipelines().shareReplay(1)
    this.stages = this.salesService.stages().shareReplay(1)
  }

  ngOnInit(): void {
    this.state.subscribe()
    this.uiActions.next('init')
  }

  public onPipelineChange(id: number | undefined): void {
    this.onSetFilterChange('pipeline_id', id)
  }

  public onStageChange(id: number | undefined): void {
    this.onSetFilterChange('stage_id', id)
  }

  public loadPrevPage(): void {
    this.uiActions.next('prev')
  }

  public loadNextPage(): void {
    this.uiActions.next('next')
  }

  public showLead(lead: Lead): void {
    this.navController.setRoot('LeadPage', { id: lead.id })
  }

  public newLead(): void {
    this.uiActions.next('newLead')
  }

  get areAllContactsVisible(): Observable<boolean> {
    return this.state.map(
      (state) => state.requestOptions.params.get('pipeline_id') === null
    )
  }

  get isStageColumnVisible(): Observable<boolean> {
    return this.state
      .withLatestFrom(this.areAllContactsVisible)
      .map(([state, areAllContactsVisible]) => {
        return (
          areAllContactsVisible ||
          state.requestOptions.params.get('stage_id') === null
        )
      })
  }

  get activePipelineId(): Observable<number | null> {
    return this.state.map((state) => {
      const id = state.pipelineId
      return id ? +id : null
    })
  }

  get activePipeline(): Observable<Pipeline | null> {
    return this.activePipelineId
      .withLatestFrom(this.pipelines)
      .map(([id, pipelines]) => {
        if (id === null) {
          return null
        } else {
          return pipelines.find((pipeline) => pipeline.id === id) || null
        }
      })
  }

  get stagesForActivePipeline(): Observable<ReadonlyArray<Stage>> {
    return this.activePipeline
      .withLatestFrom(this.stages)
      .map(([pipeline, stages]) => {
        if (pipeline === null) {
          return stages
        } else {
          return stages
            .filter((stage) => stage.pipeline_id === pipeline.id)
            .sort(
              (a, b) =>
                pipeline.stage_order.indexOf(a.id) -
                pipeline.stage_order.indexOf(b.id)
            )
        }
      })
  }

  get leads(): Observable<ReadonlyArray<Lead>> {
    return this.state.map((state) => state.leads.items)
  }

  public stageForLead(lead: Lead): Observable<Stage | undefined> {
    return this.stages.map((stages) =>
      stages.find((stage) => stage.id === lead.stage_id)
    )
  }

  get isPrevPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.leads.prevPageLink === null)
  }

  get isNextPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.leads.nextPageLink === null)
  }

  private onSetFilterChange(type: FilterType, id: number | undefined): void {
    this.uiActions.next({
      name: 'setFilter',
      type: type,
      value: typeof id === 'number' ? id.toString() : undefined
    })
  }

  // Changes options based on the action peformed by the user.
  private actionToRequestOptions(
    state: IState,
    action: UserAction
  ): IHttpRequestOptions {
    switch (action) {
      case 'init':
        return state.requestOptions
      case 'prev':
        return { ...state.requestOptions, url: state.leads.prevPageLink }
      case 'next':
        return { ...state.requestOptions, url: state.leads.nextPageLink }
      case 'newLead':
        return state.requestOptions
      default:
        // assume setFilter
        return {
          params: this.paramsWithFilter(
            state.requestOptions.params,
            action.type,
            action.value
          ),
          url: null
        }
    }
  }

  private paramsWithFilter(
    params: HttpParams,
    type: FilterType,
    value: string | undefined
  ): HttpParams {
    switch (type) {
      case 'pipeline_id':
        if (value === undefined) {
          return new HttpParams()
        } else {
          return new HttpParams().set(type, value)
        }
      default:
        if (value === undefined) {
          return params.delete(type)
        } else {
          return params.set(type, value)
        }
    }
  }

  private isSetFilter(action: UserAction): action is ISetFilter {
    return (action as ISetFilter).name === 'setFilter'
  }

  private nextPipelineId(
    state: IState,
    action: UserAction
  ): string | undefined {
    return this.isSetFilter(action) && action.type === 'pipeline_id'
      ? action.value
      : state.pipelineId
  }

  private nextStageId(state: IState, action: UserAction): string | undefined {
    if (this.isSetFilter(action)) {
      return action.type === 'pipeline_id' ? undefined : action.value
    } else {
      return state.stageId
    }
  }

  private showNewLeadModal(stageId: string | undefined): void {
    const modal = this.modalController.create(
      'NewLeadPage',
      { stageId: stageId ? +stageId : undefined },
      {
        cssClass: 'new-lead-page-modal'
      }
    )
    modal.present()
  }
}
