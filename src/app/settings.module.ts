import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { SettingsPageWithMenuComponent } from './settings/settings-page-with-menu.component'

@NgModule({
  declarations: [SettingsPageWithMenuComponent],
  entryComponents: [],
  exports: [SettingsPageWithMenuComponent],
  imports: [IonicModule],
  providers: []
})
export class SettingsModule {}
