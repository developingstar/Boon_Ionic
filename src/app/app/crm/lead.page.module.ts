import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { CrmComponentsModule } from './crm.components.module'
import { LeadPage } from './lead.page'

@NgModule({
  declarations: [LeadPage],
  entryComponents: [LeadPage],
  imports: [
    CrmComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(LeadPage),
    NavModule
  ]
})
export class LeadPageModule {}
