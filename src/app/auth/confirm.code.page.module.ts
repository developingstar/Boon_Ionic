import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { ConfirmCodePage } from './confirm.code.page'

@NgModule({
  declarations: [ConfirmCodePage],
  entryComponents: [ConfirmCodePage],
  imports: [IonicPageModule.forChild(ConfirmCodePage), NavModule, InlineSVGModule]
})
export class ConfirmCodePageModule {}
