import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { TemplateActionsComponent } from './template-actions.component'

@NgModule({
  declarations: [TemplateActionsComponent],
  entryComponents: [],
  exports: [TemplateActionsComponent],
  imports: [IonicPageModule.forChild(TemplateActionsComponent)]
})
export class TemplateActionsComponentModule {}
