import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { AuthService } from './auth/auth.service'
import { CurrentUserService } from './auth/current-user.service'

@NgModule({
  declarations: [],
  entryComponents: [],
  exports: [],
  imports: [IonicModule],
  providers: [AuthService, CurrentUserService]
})
export class AuthModule {}
