import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { LoginPage } from './login.page'

@NgModule({
  declarations: [LoginPage],
  entryComponents: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage), NavModule, InlineSVGModule]
})
export class LoginPageModule {}
