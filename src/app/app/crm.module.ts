import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { SalesService } from './crm/sales.service'
import { UsersService } from './crm/users.service'

@NgModule({
  declarations: [],
  entryComponents: [],
  exports: [],
  imports: [IonicModule],
  providers: [SalesService, UsersService]
})
export class CrmModule {}
