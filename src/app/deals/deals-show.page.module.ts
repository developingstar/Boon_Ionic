import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { PipelineComponent } from '../crm/pipeline.component'
import { NavModule } from '../nav.module'
import { ShowTabsComponentsModule } from '../show-tabs/show-tabs.components.module'
import { DealsShowPage } from './deals-show.page'
import { DealsComponentsModule } from './deals.components.module'
@NgModule({
  declarations: [DealsShowPage, PipelineComponent],
  entryComponents: [DealsShowPage],
  exports: [PipelineComponent],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(DealsShowPage),
    NavModule,
    DealsComponentsModule,
    ShowTabsComponentsModule
  ]
})
export class DealsShowPageModule {}
