import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { ReactiveFormsModule } from '@angular/forms'
import { SettingsModule } from '../../settings.module'

import { NavModule } from '../../nav.module'
import { AddEditTeamMemberPage } from './add-edit-team-member.page'

@NgModule({
  declarations: [AddEditTeamMemberPage],
  entryComponents: [AddEditTeamMemberPage],
  imports: [
    IonicPageModule.forChild(AddEditTeamMemberPage),
    InlineSVGModule,
    NavModule,
    SettingsModule,
    ReactiveFormsModule
  ]
})
export class AddEditTeamMemberPageModule {}
