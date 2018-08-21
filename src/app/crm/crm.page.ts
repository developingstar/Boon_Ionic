import { HttpParams } from '@angular/common/http'
import { Component } from '@angular/core'
import { IonicPage, ModalController, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { IHttpRequestOptions } from '../api/http-request-options'
import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { Contact } from './contact.model'
import {
  FilterType,
  initialState,
  ISetFilter,
  IState,
  UserAction
} from './crm.page.state'
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
export class CrmPage extends ReactivePage<IState, UserAction> {
  readonly pipelines: Observable<ReadonlyArray<Pipeline>>

  public showingLow: number = 1
  public showingHigh: number = 50

  private readonly stages: Observable<ReadonlyArray<Stage>>

  constructor(
    private readonly salesService: SalesService,
    private readonly modalController: ModalController,
    private readonly navController: NavController,
    private readonly currentUserService: CurrentUserService
  ) {
    super(initialState)

    this.pipelines = this.salesService.pipelines().shareReplay(1)
    this.stages = this.salesService.stages().shareReplay(1)
  }

  public onPipelineChange(id: number | undefined): void {
    this.showingLow = 1
    this.contactCount.subscribe((count: number) => {
      count < this.salesService.limit
        ? (this.showingHigh = count)
        : (this.showingHigh = this.salesService.limit)
    })
    this.onSetFilterChange('pipeline_id', id)
  }

  public onStageChange(id: number | undefined): void {
    this.onSetFilterChange('stage_id', id)
  }

  public loadPrevPage(): void {
    if (this.isPrevPageButtonDisabled) {
      this.showingLow = 1
      this.contactCount.subscribe((count: number) => {
        count < this.salesService.limit
          ? (this.showingHigh = count)
          : (this.showingHigh = this.salesService.limit)
      })
    } else {
      this.showingLow -= this.salesService.limit
      this.showingHigh -= this.salesService.limit
    }
    this.uiActions.next('prev')
  }

  public loadNextPage(): void {
    this.showingLow += this.salesService.limit
    this.isNextPageButtonDisabled
      ? this.contactCount.subscribe(
          (count: number) => (this.showingHigh = count)
        )
      : (this.showingHigh += this.salesService.limit)
    this.uiActions.next('next')
  }

  public showContact(contact: Contact): void {
    this.navController.push('ContactPage', { id: contact.id })
  }

  public newContact(): void {
    this.uiActions.next('newContact')
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

  get pipelineName(): Observable<string> {
    return this.activePipelineId
      .withLatestFrom(this.pipelines)
      .map(([id, pipelines]) => {
        if (id === null) {
          return 'All Contacts'
        } else {
          const activePipeline =
            pipelines.find((pipeline) => pipeline.id === id) || null
          return activePipeline ? activePipeline.name : ''
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
            .filter((stage) => stage.pipelineId === pipeline.id)
            .sort(
              (a, b) =>
                pipeline.stageOrder.indexOf(a.id) -
                pipeline.stageOrder.indexOf(b.id)
            )
        }
      })
  }

  get contacts(): Observable<ReadonlyArray<Contact>> {
    return this.state.map((state) => {
      return state.contacts.items
    })
  }

  get contactCount(): any {
    return this.state.map((state) => {
      if (state.contacts.count) {
        return +state.contacts.count
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 'Unknown'
      }
    })
  }

  public stageForContact(contact: Contact): Observable<Stage | undefined> {
    return this.stages.map((stages) =>
      stages.find((stage) => stage.id === contact.stageId)
    )
  }

  get isPrevPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.contacts.prevPageLink === null)
  }

  get isNextPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.contacts.nextPageLink === null)
  }

  protected initialAction(): UserAction {
    return 'init'
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    if (action === 'newContact') {
      this.showNewContactModal(state.stageId)
      return Observable.of(state)
    } else {
      const newRequestOptions = this.actionToRequestOptions(state, action)
      return this.salesService
        .contacts(newRequestOptions)
        .map((newContacts) => ({
          contacts: newContacts,
          pipelineId: this.nextPipelineId(state, action),
          requestOptions: newRequestOptions,
          stageId: this.nextStageId(state, action)
        }))
    }
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
        return { ...state.requestOptions, url: state.contacts.prevPageLink }
      case 'next':
        return { ...state.requestOptions, url: state.contacts.nextPageLink }
      case 'newContact':
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
      case 'stage_id':
        if (value === undefined) {
          return params.delete(type)
        } else {
          return params.set('stage_id', value)
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

  private showNewContactModal(stageId: string | undefined): void {
    const modal = this.modalController.create(
      'NewContactPage',
      { stageId: stageId ? +stageId : undefined },
      {
        cssClass: 'new-contact-page-modal'
      }
    )
    modal.present()
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).CrmPage !== undefined
  }

  private ionViewWillEnter(): void {
    this.showingLow = 1
    this.contactCount.subscribe((count: number) => {
      count < this.salesService.limit
        ? (this.showingHigh = count)
        : (this.showingHigh = this.salesService.limit)
    })
  }
}
