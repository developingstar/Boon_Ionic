import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { AssignStageModalComponent } from './assign-stage-modal.component'

@NgModule({
  declarations: [AssignStageModalComponent],
  entryComponents: [],
  exports: [AssignStageModalComponent],
  imports: [EventModule, IonicPageModule.forChild(AssignStageModalComponent)]
})
export class AssignStageModalComponentModule {}
