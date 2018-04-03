import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { JourneysPage } from './journeys.page'

@NgModule({
  declarations: [JourneysPage],
  entryComponents: [JourneysPage],
  imports: [InlineSVGModule, IonicPageModule.forChild(JourneysPage), NavModule]
})
export class JourneysPageModule {}
