import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { TeamMembersPage } from './team-members.page'

@NgModule({
  declarations: [TeamMembersPage],
  entryComponents: [TeamMembersPage],
  imports: [
    IonicPageModule.forChild(TeamMembersPage),
    InlineSVGModule,
    NavModule,
    SettingsModule
  ]
})
export class TeamMembersPageModule {}
