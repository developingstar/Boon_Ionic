import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { NavModule } from '../nav.module'
import { EmailTemplatePage } from './email-template.page'

@NgModule({
  declarations: [EmailTemplatePage],
  entryComponents: [EmailTemplatePage],
  imports: [IonicPageModule.forChild(EmailTemplatePage), NavModule]
})
export class EmailTemplatePageModule {}
