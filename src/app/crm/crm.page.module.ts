import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { CrmComponentsModule } from './crm.components.module'
import { CrmPage } from './crm.page'

@NgModule({
  declarations: [CrmPage],
  entryComponents: [CrmPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(CrmPage),
    NavModule,
    CrmComponentsModule
  ]
})
export class CrmPageModule {}
