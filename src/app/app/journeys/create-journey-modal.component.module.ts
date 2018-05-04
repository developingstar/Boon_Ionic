import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { CreateJourneyModalComponent } from './create-journey-modal.component'

@NgModule({
  declarations: [CreateJourneyModalComponent],
  entryComponents: [],
  exports: [CreateJourneyModalComponent],
  imports: [IonicPageModule.forChild(CreateJourneyModalComponent)]
})
export class CreateJourneyModalComponentModule {}
