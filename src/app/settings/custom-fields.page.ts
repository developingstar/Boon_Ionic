import { Component } from '@angular/core'
import { IonicPage } from 'ionic-angular'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'

@IonicPage({
  segment: 'settings/cms/custom-fields'
})
@Component({
  selector: 'custom-fields-page',
  templateUrl: 'custom-fields.page.html'
})
export class CustomFieldsPage {
  constructor(private currentUserService: CurrentUserService) {}

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).CustomFieldsPage !== undefined
  }
}
