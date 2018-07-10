import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CommonComponentsModule } from '../common.components.module'
import { NewContactPage } from './new-contact.page'

@NgModule({
  declarations: [NewContactPage],
  entryComponents: [NewContactPage],
  imports: [
    CommonComponentsModule,
    InlineSVGModule,
    IonicPageModule.forChild(NewContactPage)
  ]
})
export class NewContactPageModule {}
