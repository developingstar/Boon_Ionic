import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CommonComponentsModule } from '../common.components.module'
import { NavModule } from '../nav.module'
import { LeadPage } from './lead.page'

@NgModule({
  declarations: [LeadPage],
  entryComponents: [LeadPage],
  imports: [
    CommonComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(LeadPage),
    NavModule
  ]
})
export class LeadPageModule {}
