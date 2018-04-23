import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { MessagesService } from './messages/messages.service'
import { PhoneNumbersService } from './messages/phone-numbers.service'

@NgModule({
  declarations: [],
  entryComponents: [],
  exports: [],
  imports: [IonicModule],
  providers: [MessagesService, PhoneNumbersService]
})
export class MessagesModule {}
