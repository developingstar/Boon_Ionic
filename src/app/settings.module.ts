import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { AlertService } from './settings/alert.service'
import { GroupsService } from './settings/groups.service'
import { IntegrationsService } from './settings/integrations.service'
import { SettingsPageWithMenuComponent } from './settings/settings-page-with-menu.component'
import { TeamMembersService } from './settings/team-members/team-members.service'
import { PurescriptComponent } from './utils/purescript.component'

@NgModule({
  declarations: [PurescriptComponent, SettingsPageWithMenuComponent],
  entryComponents: [],
  exports: [PurescriptComponent, SettingsPageWithMenuComponent],
  imports: [IonicModule],
  providers: [
    IntegrationsService,
    GroupsService,
    TeamMembersService,
    AlertService
  ]
})
export class SettingsModule {}
