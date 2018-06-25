import { HttpParams } from '@angular/common/http'
import { Component } from '@angular/core'
import { IonicPage, NavParams, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'
import {
  initialState,
  IState,
  UserAction
} from './search-results.page.state'

import { IHttpRequestOptions } from '../api/http-request-options'
import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { SalesService } from './sales.service'
import { Lead } from './lead.model'
import { Deal } from '../deals/deal.model'

@IonicPage({
  segment: 'search-results'
})
@Component({
  selector: 'search-results-page',
  templateUrl: 'search-results.page.html'
})
export class SearchResultsPage extends ReactivePage<IState, UserAction> {
  public selectedNavItem: string
  private query: string

  constructor(
    public navParams: NavParams,
    private readonly salesService: SalesService,
    private readonly navController: NavController,
    private readonly currentUserService: CurrentUserService
  ) {
    super(initialState)
  }

  ngOnInit(): void {
    this.selectedNavItem = 'contact'
    this.query = this.navParams.get('query')
    this.uiActions.next({ name: 'init', category: 'contact' })
  }

  public setNavItem(item: string): void {
    this.selectedNavItem = item
    this.uiActions.next({ name: 'init', category: this.selectedNavItem })
  }

  public loadPrevPage(): void {
    this.uiActions.next({ name: 'prev' })
  }

  public loadNextPage(): void {
    this.uiActions.next({ name: 'next' })
  }

  get isPrevPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.results.prevPageLink === null)
  }

  get isNextPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => state.results.nextPageLink === null)
  }

  get results(): Observable<ReadonlyArray<Lead> | ReadonlyArray<Deal>> {
    return this.state.map((state) => {
      return state.results.items
    })
  }

  protected initialAction(): UserAction {
    return { name: 'init', category: 'contact' }
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    const newRequestOptions = this.actionToRequestOptions(state, action)
    return this.salesService.leads(newRequestOptions).map((newLeads) => ({
      results: newLeads,
      type: 'contact',
      requestOptions: newRequestOptions,
    }))
  }

  // Changes options based on the action peformed by the user.
  private actionToRequestOptions(
    state: IState,
    action: UserAction
  ): IHttpRequestOptions {
    switch (action.name) {
      case 'init':
        return {
          params: this.paramsWithFilter(
            state.requestOptions.params,
            this.query,
          ),
          url: null
        }
      case 'prev':
        return { ...state.requestOptions, url: state.results.prevPageLink }
      case 'next':
        return { ...state.requestOptions, url: state.results.nextPageLink }
    }
  }

  private paramsWithFilter(
    params: HttpParams,
    value: string
  ): HttpParams {
    return params.set('query', value)
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).CrmPage !== undefined
  }

  private ionViewWillEnter(): void {
    return
  }
}
