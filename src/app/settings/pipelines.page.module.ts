import { NgModule } from '@angular/core'
import { SortablejsModule } from 'angular-sortablejs'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { SettingsModule } from '../settings.module'

import { NavModule } from '../nav.module'
import { PipelinesPage } from './pipelines.page'

@NgModule({
  declarations: [PipelinesPage],
  entryComponents: [PipelinesPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(PipelinesPage),
    NavModule,
    SettingsModule,
    SortablejsModule
  ]
})
export class PipelinesPageModule {}
