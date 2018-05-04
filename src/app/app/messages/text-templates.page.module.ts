import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { NavModule } from '../nav.module'
import { TextTemplatesPage } from './text-templates.page'

@NgModule({
  declarations: [TextTemplatesPage],
  entryComponents: [TextTemplatesPage],
  imports: [IonicPageModule.forChild(TextTemplatesPage), NavModule]
})
export class TextTemplatesPageModule {}
