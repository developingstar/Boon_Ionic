import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { GroupsService } from './settings/groups.service'
import { IntegrationsService } from './settings/integrations.service'
import { SettingsPageWithMenuComponent } from './settings/settings-page-with-menu.component'

@NgModule({
  declarations: [SettingsPageWithMenuComponent],
  entryComponents: [],
  exports: [SettingsPageWithMenuComponent],
  imports: [IonicModule],
  providers: [IntegrationsService, GroupsService]
})
export class SettingsModule {}
