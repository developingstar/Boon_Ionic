import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { UpdateFieldModalComponent } from './update-field-modal.component'

@NgModule({
  declarations: [UpdateFieldModalComponent],
  entryComponents: [],
  exports: [UpdateFieldModalComponent],
  imports: [EventModule, IonicPageModule.forChild(UpdateFieldModalComponent)]
})
export class UpdateFieldModalComponentModule {}
