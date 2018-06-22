import { HttpParams } from '@angular/common/http'
import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'
import {
  FilterType,
  initialState,
  ISetFilter,
  IState,
  UserAction
} from './search-results.page.state'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { SalesService } from './sales.service'

@IonicPage({
  segment: 'search-results/:query'
})
@Component({
  selector: 'search-results-page',
  templateUrl: 'search-results.page.html'
})
export class SearchResultsPage extends ReactivePage<IState, UserAction> {
  public selectedNavItem: string
  public results: any[]

  constructor(
    private readonly salesService: SalesService,
    private readonly navController: NavController,
    private readonly currentUserService: CurrentUserService
  ) {
    super(initialState)
  }

  ngOnInit(): void {
    this.selectedNavItem = 'contact'
    // this.uiActions.next({ name: 'init', category: 'contact' })
  }

  public setNavItem(item: string): void {
    this.selectedNavItem = item
    // this.uiActions.next({ name: 'init', category: this.selectedNavItem })
  }

  protected initialAction(): UserAction {
    return 'init'
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    return Observable.of(state)
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
