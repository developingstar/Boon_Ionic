import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { SettingsModule } from '../settings.module'
import { IntegrationPage } from './integration.page'

@NgModule({
  declarations: [IntegrationPage],
  entryComponents: [IntegrationPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(IntegrationPage),
    NavModule,
    SettingsModule
  ]
})
export class IntegrationPageModule {}
