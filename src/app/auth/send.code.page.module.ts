import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { SendCodePage } from './send.code.page'

@NgModule({
  declarations: [SendCodePage],
  entryComponents: [SendCodePage],
  imports: [IonicPageModule.forChild(SendCodePage), NavModule, InlineSVGModule]
})
export class SendCodePageModule {}
