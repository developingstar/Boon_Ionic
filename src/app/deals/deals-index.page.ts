import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { PaginatedList } from '../api/paginated-list'
import { CurrentUserService } from '../auth/current-user.service'
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
  public deals: any
  public count: string
  public owner: any

  constructor(
    private dealsService: DealsService,
    private currentUserService: CurrentUserService,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.getDeals()
  }

  getDeals(url?: string): void {
    this.dealsService.deals(url).subscribe((res) => {
      this.pageData = res
      this.deals = this.pageData.items
    })
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

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).DealsIndexPage !== undefined
  }
}
