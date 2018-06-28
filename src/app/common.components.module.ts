import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { FieldComponent } from './crm/field.component'
import { PipelineComponent } from './crm/pipeline.component'
import { ReactiveFormsDisabledDirective } from './crm/reactive-forms-disabled.directive'

@NgModule({
  declarations: [
    FieldComponent,
    PipelineComponent,
    ReactiveFormsDisabledDirective
  ],
  entryComponents: [],
  exports: [FieldComponent, PipelineComponent, ReactiveFormsDisabledDirective],
  imports: [IonicModule]
})
export class CommonComponentsModule {}
