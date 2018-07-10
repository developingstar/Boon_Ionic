import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SignupPage } from './signup.page'
@NgModule({
  declarations: [SignupPage],
  entryComponents: [SignupPage],
  imports: [InlineSVGModule, IonicPageModule.forChild(SignupPage)]
})
export class SignupPageModule {}
