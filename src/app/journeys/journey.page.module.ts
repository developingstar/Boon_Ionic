import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { JourneyPage } from './journey.page'

@NgModule({
  declarations: [JourneyPage],
  entryComponents: [JourneyPage],
  imports: [InlineSVGModule, IonicPageModule.forChild(JourneyPage), NavModule]
})
export class JourneyPageModule {}
