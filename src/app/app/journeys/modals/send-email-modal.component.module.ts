import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { SendEmailModalComponent } from './send-email-modal.component'

@NgModule({
  declarations: [SendEmailModalComponent],
  entryComponents: [],
  exports: [SendEmailModalComponent],
  imports: [EventModule, IonicPageModule.forChild(SendEmailModalComponent)]
})
export class SendEmailModalComponentModule {}
