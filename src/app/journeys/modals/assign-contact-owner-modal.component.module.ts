import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { AssignContactOwnerModalComponent } from './assign-contact-owner-modal.component'

@NgModule({
  declarations: [AssignContactOwnerModalComponent],
  entryComponents: [],
  exports: [AssignContactOwnerModalComponent],
  imports: [
    EventModule,
    IonicPageModule.forChild(AssignContactOwnerModalComponent)
  ]
})
export class AssignContactOwnerModalComponentModule {}
