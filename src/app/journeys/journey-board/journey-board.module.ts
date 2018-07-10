import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { NgDragDropModule } from 'ng-drag-drop'
import { InlineSVGModule } from 'ng-inline-svg'
import { NavModule } from '../../nav.module'
import { EventModule } from '../events/../boxes/event.module'
import { JourneyBoardPage } from './journey-board'
@NgModule({
  declarations: [JourneyBoardPage],
  imports: [
    IonicPageModule.forChild(JourneyBoardPage),
    NgDragDropModule.forRoot(),
    NavModule,
    EventModule,
    InlineSVGModule
  ]
})
export class JourneyBoardPageModule {}
