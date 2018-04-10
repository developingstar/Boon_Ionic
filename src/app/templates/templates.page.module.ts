import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { TemplatesPage } from './templates.page'

@NgModule({
  declarations: [TemplatesPage],
  entryComponents: [TemplatesPage],
  imports: [InlineSVGModule, IonicPageModule.forChild(TemplatesPage), NavModule]
})
export class TemplatesPageModule {}
