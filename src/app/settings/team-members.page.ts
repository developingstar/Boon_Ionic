import { Component } from '@angular/core'
import { IonicPage } from 'ionic-angular'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'

@IonicPage({
  segment: 'settings/team/team-members'
})
@Component({
  selector: 'team-members-page',
  templateUrl: 'team-members.page.html'
})
export class TeamMembersPage {
  constructor(private currentUserService: CurrentUserService) {}

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).TeamMembersPage !== undefined
  }
}
