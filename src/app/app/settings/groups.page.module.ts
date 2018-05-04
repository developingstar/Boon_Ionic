import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { GroupsPage } from './groups.page'

@NgModule({
  declarations: [GroupsPage],
  entryComponents: [GroupsPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(GroupsPage),
    NavModule,
    SettingsModule
  ]
})
export class GroupsPageModule {}
