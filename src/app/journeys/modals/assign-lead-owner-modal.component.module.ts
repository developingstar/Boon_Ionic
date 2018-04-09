import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { AssignLeadOwnerModalComponent } from './assign-lead-owner-modal.component'

@NgModule({
  declarations: [AssignLeadOwnerModalComponent],
  entryComponents: [],
  exports: [AssignLeadOwnerModalComponent],
  imports: [
    EventModule,
    IonicPageModule.forChild(AssignLeadOwnerModalComponent)
  ]
})
export class AssignLeadOwnerModalComponentModule {}
