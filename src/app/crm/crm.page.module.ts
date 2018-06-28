import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CommonComponentsModule } from '../common.components.module'
import { NavModule } from '../nav.module'
import { CrmPage } from './crm.page'

@NgModule({
  declarations: [CrmPage],
  entryComponents: [CrmPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(CrmPage),
    NavModule,
    CommonComponentsModule
  ]
})
export class CrmPageModule {}
