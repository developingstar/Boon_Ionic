import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { AssignOwnerModalComponent } from './assign-owner-modal.component'

@NgModule({
  declarations: [AssignOwnerModalComponent],
  entryComponents: [],
  exports: [AssignOwnerModalComponent],
  imports: [EventModule, IonicPageModule.forChild(AssignOwnerModalComponent)]
})
export class AssignOwnerModalComponentModule {}
