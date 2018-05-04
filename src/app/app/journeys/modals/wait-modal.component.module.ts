import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { WaitModalComponent } from './wait-modal.component'

@NgModule({
  declarations: [WaitModalComponent],
  entryComponents: [],
  exports: [WaitModalComponent],
  imports: [EventModule, IonicPageModule.forChild(WaitModalComponent)]
})
export class WaitModalComponentModule {}
