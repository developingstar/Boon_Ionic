import { Component, Input } from '@angular/core'
import { NavController } from 'ionic-angular'

import { User } from '../../auth/user.model'

@Component({
  selector: 'team-member-component',
  templateUrl: 'team-member.component.html'
})
export class TeamMemberComponent {
  @Input() public readonly teamMembers: ReadonlyArray<User> = []

  constructor(private readonly navController: NavController) {}

  goToTeamMember(id: string): void {
    this.navController.push('AddEditTeamMemberPage', { teamMemberId: id })
  }
}
