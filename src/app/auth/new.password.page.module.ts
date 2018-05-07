import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { NewPasswordPage } from './new.password.page'

@NgModule({
  declarations: [NewPasswordPage],
  entryComponents: [NewPasswordPage],
  imports: [
    IonicPageModule.forChild(NewPasswordPage),
    NavModule,
    InlineSVGModule
  ]
})
export class NewPasswordPageModule {}
