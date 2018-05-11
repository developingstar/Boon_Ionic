import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../../settings.module'

import { NavModule } from '../../nav.module'
import { TeamMemberComponentModule } from './team-member.component.module'
import { TeamMembersPage } from './team-members.page'

@NgModule({
  declarations: [TeamMembersPage],
  entryComponents: [TeamMembersPage],
  imports: [
    IonicPageModule.forChild(TeamMembersPage),
    InlineSVGModule,
    NavModule,
    SettingsModule,
    TeamMemberComponentModule
  ]
})
export class TeamMembersPageModule {}
