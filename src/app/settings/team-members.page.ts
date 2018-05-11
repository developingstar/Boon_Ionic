import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'
import { TeamMembersService } from './team-members.service'

import { User } from '../../auth/user.model'

@IonicPage()
@Component({
  selector: 'page-team-members',
  templateUrl: 'team-members.page.html'
})
export class TeamMembersPage implements OnInit {
  public teamMembers: Observable<User[]>

  constructor(
    public navController: NavController,
    public teamMemberService: TeamMembersService
  ) {}

  ngOnInit(): void {
    this.teamMembers = this.teamMemberService.getTeamMembers()
  }
}
