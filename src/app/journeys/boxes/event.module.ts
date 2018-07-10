import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { InlineSVGModule } from 'ng-inline-svg'
import { ContactOwnerDetailsComponent } from './contact-owner-details.component'
import { EmailTemplateDetailsComponent } from './email-template-details.component'
import { EventComponent } from './event.component'
import { FieldDetailsComponent } from './field-details.component'
import { PipelineDetailsComponent } from './pipeline-details.component'
import { StageDetailsComponent } from './stage-details.component'
import { TextTemplateDetailsComponent } from './text-template-details.component'
import { WaitDetailsComponent } from './wait-details.component'

@NgModule({
  declarations: [
    EventComponent,
    StageDetailsComponent,
    ContactOwnerDetailsComponent,
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
    ContactOwnerDetailsComponent,
    FieldDetailsComponent,
    PipelineDetailsComponent,
    TextTemplateDetailsComponent,
    EmailTemplateDetailsComponent,
    WaitDetailsComponent
  ],
  imports: [CommonModule, InlineSVGModule]
})
export class EventModule {}
