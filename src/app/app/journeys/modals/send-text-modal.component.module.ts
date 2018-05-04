import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { SendTextModalComponent } from './send-text-modal.component'

@NgModule({
  declarations: [SendTextModalComponent],
  entryComponents: [],
  exports: [SendTextModalComponent],
  imports: [EventModule, IonicPageModule.forChild(SendTextModalComponent)]
})
export class SendTextModalComponentModule {}
