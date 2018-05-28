import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { ReactiveFormsModule } from '@angular/forms'
import { NavModule } from '../../nav.module'
import { SettingsModule } from '../../settings.module'

import { AccountSettingsPage } from './account-settings'

@NgModule({
  declarations: [AccountSettingsPage],
  entryComponents: [AccountSettingsPage],
  imports: [
    IonicPageModule.forChild(AccountSettingsPage),
    NavModule,
    SettingsModule,
    ReactiveFormsModule
  ]
})
export class AccountSettingsPageModule {}
