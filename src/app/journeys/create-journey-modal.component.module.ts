import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { NgSelectModule } from '@ng-select/ng-select'
import { CreateJourneyModalComponent } from './create-journey-modal.component'

@NgModule({
  declarations: [CreateJourneyModalComponent],
  entryComponents: [],
  exports: [CreateJourneyModalComponent],
  imports: [
    IonicPageModule.forChild(CreateJourneyModalComponent),
    NgSelectModule
  ]
})
export class CreateJourneyModalComponentModule {}
