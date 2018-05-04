import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { InlineSVGModule } from 'ng-inline-svg'
import { EmailTemplateDetailsComponent } from './email-template-details.component'
import { EventComponent } from './event.component'
import { FieldDetailsComponent } from './field-details.component'
import { LeadOwnerDetailsComponent } from './lead-owner-details.component'
import { PipelineDetailsComponent } from './pipeline-details.component'
import { StageDetailsComponent } from './stage-details.component'
import { TextTemplateDetailsComponent } from './text-template-details.component'
import { WaitDetailsComponent } from './wait-details.component'

@NgModule({
  declarations: [
    EventComponent,
    StageDetailsComponent,
    LeadOwnerDetailsComponent,
    FieldDetailsComponent,
    PipelineDetailsComponent,
    TextTemplateDetailsComponent,
    EmailTemplateDetailsComponent,
    WaitDetailsComponent
  ],
  entryComponents: [],
  exports: [
    EventComponent,
    StageDetailsComponent,
    LeadOwnerDetailsComponent,
    FieldDetailsComponent,
    PipelineDetailsComponent,
    TextTemplateDetailsComponent,
    EmailTemplateDetailsComponent,
    WaitDetailsComponent
  ],
  imports: [CommonModule, InlineSVGModule]
})
export class EventModule {}
