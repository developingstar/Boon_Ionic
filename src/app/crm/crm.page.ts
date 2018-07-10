import { HttpParams } from '@angular/common/http'
import { Component } from '@angular/core'
import { IonicPage, ModalController, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { IHttpRequestOptions } from '../api/http-request-options'
import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { Contact } from './contact.model'
import { initialState, IState, SortType, UserAction } from './crm.page.state'
import { SalesService } from './sales.service'

@IonicPage({
  segment: 'crm'
})
@Component({
  selector: 'crm-page',
  templateUrl: 'crm.page.html'
})
export class CrmPage extends ReactivePage<IState, UserAction> {
  public showingLow: number = 1
  public showingHigh: number = 50
  readonly sortList = [
    { label: 'Name', value: 'first_name' },
    { label: 'Email', value: 'email' },
    { label: 'Phone Number', value: 'phone_number' },
    { label: 'Created At', value: 'inserted_at' },
    { label: 'Contact Owner', value: 'owner' }
  ]

  constructor(
    private readonly salesService: SalesService,
    private readonly modalController: ModalController,
    private readonly navController: NavController,
    private readonly currentUserService: CurrentUserService
  ) {
    super(initialState)
  }

  public sortSelected(value: string): void {
    this.uiActions.next({
      name: 'setSorter',
      type: 'order_by',
      value: value + ':desc'
    })
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
    this.navController.push('ContactShowPage', { id: contact.id })
  }

  public newContact(): void {
    this.uiActions.next('newContact')
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
      this.showNewContactModal()
      return Observable.of(state)
    } else {
      const newRequestOptions = this.actionToRequestOptions(state, action)
      return this.salesService
        .contacts(newRequestOptions)
        .map((newContacts) => ({
          contacts: newContacts,
          requestOptions: newRequestOptions
        }))
    }
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
        return { params: new HttpParams(), url: state.contacts.prevPageLink }
      case 'next':
        return { params: new HttpParams(), url: state.contacts.nextPageLink }
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
    type: SortType,
    value: string | undefined
  ): HttpParams {
    switch (type) {
      case 'order_by':
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

  private showNewContactModal(): void {
    const modal = this.modalController.create(
      'NewContactPage',
      { stageId: undefined },
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
