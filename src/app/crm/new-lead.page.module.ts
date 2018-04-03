import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CrmComponentsModule } from './crm.components.module'
import { NewLeadPage } from './new-lead.page'

@NgModule({
  declarations: [NewLeadPage],
  entryComponents: [NewLeadPage],
  imports: [
    CrmComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(NewLeadPage)
  ]
})
export class NewLeadPageModule {}
