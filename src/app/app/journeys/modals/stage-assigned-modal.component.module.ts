import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { StageAssignedModalComponent } from './stage-assigned-modal.component'

@NgModule({
  declarations: [StageAssignedModalComponent],
  entryComponents: [],
  exports: [StageAssignedModalComponent],
  imports: [EventModule, IonicPageModule.forChild(StageAssignedModalComponent)]
})
export class StageAssignedModalComponentModule {}
