import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CommonComponentsModule } from '../common.components.module'
import { NavModule } from '../nav.module'
import { ShowTabsComponentsModule } from '../show-tabs/show-tabs.components.module'
import { ContactShowPage } from './contact-show.page'

@NgModule({
  declarations: [ContactShowPage],
  entryComponents: [ContactShowPage],
  imports: [
    CommonComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(ContactShowPage),
    ShowTabsComponentsModule,
    NavModule
  ]
})
export class ContactShowPageModule {}
