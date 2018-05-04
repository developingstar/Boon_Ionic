import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EventModule } from './../boxes/event.module'
import { FieldUpdatedModalComponent } from './field-updated-modal.component'

@NgModule({
  declarations: [FieldUpdatedModalComponent],
  entryComponents: [],
  exports: [FieldUpdatedModalComponent],
  imports: [EventModule, IonicPageModule.forChild(FieldUpdatedModalComponent)]
})
export class FieldUpdatedModalComponentModule {}
