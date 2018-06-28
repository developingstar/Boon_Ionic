import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CommonComponentsModule } from '../common.components.module'
import { NewLeadPage } from './new-lead.page'

@NgModule({
  declarations: [NewLeadPage],
  entryComponents: [NewLeadPage],
  imports: [
    CommonComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(NewLeadPage)
  ]
})
export class NewLeadPageModule {}
