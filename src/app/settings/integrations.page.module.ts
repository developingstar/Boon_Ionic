import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { IntegrationsPage } from './integrations.page'

@NgModule({
  declarations: [IntegrationsPage],
  entryComponents: [IntegrationsPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(IntegrationsPage),
    NavModule,
    SettingsModule
  ]
})
export class IntegrationsPageModule {}
