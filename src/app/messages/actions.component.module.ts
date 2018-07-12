import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { ActionsComponent } from './actions.component'

@NgModule({
  declarations: [ActionsComponent],
  entryComponents: [],
  exports: [ActionsComponent],
  imports: [IonicPageModule.forChild(ActionsComponent)]
})
export class ActionsComponentModule {}
