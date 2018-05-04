import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { CustomFieldsPage } from './custom-fields.page'

@NgModule({
  declarations: [CustomFieldsPage],
  entryComponents: [CustomFieldsPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(CustomFieldsPage),
    NavModule,
    SettingsModule
  ]
})
export class CustomFieldsPageModule {}
