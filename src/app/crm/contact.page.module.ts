import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { ContactPage } from './contact.page'
import { CrmComponentsModule } from './crm.components.module'

@NgModule({
  declarations: [ContactPage],
  entryComponents: [ContactPage],
  imports: [
    CrmComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(ContactPage),
    NavModule
  ]
})
export class ContactPageModule {}
