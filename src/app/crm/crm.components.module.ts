import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { FieldComponent } from './field.component'
import { PipelineComponent } from './pipeline.component'
import { ReactiveFormsDisabledDirective } from './reactive-forms-disabled.directive'

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
export class CrmComponentsModule {}
