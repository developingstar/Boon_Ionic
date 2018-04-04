import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { EditStageModalPage } from './edit-stage-modal.page'

@NgModule({
  declarations: [EditStageModalPage],
  entryComponents: [EditStageModalPage],
  imports: [IonicPageModule.forChild(EditStageModalPage)]
})
export class EditStageModalPageModule {}
