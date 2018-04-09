import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { PipelineAssignedModalComponent } from './pipeline-assigned-modal.component'

@NgModule({
  declarations: [PipelineAssignedModalComponent],
  entryComponents: [],
  exports: [PipelineAssignedModalComponent],
  imports: [
    EventModule,
    IonicPageModule.forChild(PipelineAssignedModalComponent)
  ]
})
export class PipelineAssignedModalComponentModule {}
