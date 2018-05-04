import { NgModule } from '@angular/core'
import { SortablejsModule } from 'angular-sortablejs'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { EventModule } from './events/../boxes/event.module'
import { JourneyPage } from './journey.page'

@NgModule({
  declarations: [JourneyPage],
  entryComponents: [JourneyPage],
  exports: [],
  imports: [
    EventModule,
    InlineSVGModule,
    IonicPageModule.forChild(JourneyPage),
    NavModule,
    SortablejsModule
  ]
})
export class JourneyPageModule {}
