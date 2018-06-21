import { Component } from '@angular/core'
import { IonicPage } from 'ionic-angular'

import { CurrentUserService } from '../auth/current-user.service'
import { TabTypes } from '../show-tabs/tab-selector.component'
import { pageAccess } from '../utils/app-access'

@IonicPage({
  segment: 'deals/:id'
})
@Component({
  selector: 'deals-show-page',
  templateUrl: 'deals-show.page.html'
})
export class DealsShowPage {
  public leftTabs: TabTypes[] = ['Deals', 'Notes', 'Activity']
  public rightTabs: TabTypes[] = ['Texting', 'Email']
  public leftSelected: TabTypes = 'Deals'
  public rightSelected: TabTypes = 'Texting'

  constructor(private currentUserService: CurrentUserService) {}

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).DealsShowPage !== undefined
  }
}
