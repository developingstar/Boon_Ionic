import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { TwilioPage } from './twilio.page'

@NgModule({
  declarations: [TwilioPage],
  entryComponents: [TwilioPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(TwilioPage),
    NavModule,
    SettingsModule
  ]
})
export class TwilioPageModule {}
