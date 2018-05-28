import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'
import { TeamMembersService } from './team-members.service'

import { CurrentUserService } from '../../auth/current-user.service'
import { User } from '../../auth/user.model'
import { pageAccess } from '../../utils/app-access'

@IonicPage({
  segment: 'settings/team/team-members'
})
@Component({
  selector: 'page-team-members',
  templateUrl: 'team-members.page.html'
})
export class TeamMembersPage implements OnInit {
  public teamMembers: Observable<User[]>

  constructor(
    public navController: NavController,
    public teamMemberService: TeamMembersService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.teamMembers = this.teamMemberService.getTeamMembers()
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).TeamMembersPage !== undefined
  }
}
