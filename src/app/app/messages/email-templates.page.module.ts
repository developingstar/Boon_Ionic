import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { NavModule } from '../nav.module'
import { EmailTemplatesPage } from './email-templates.page'

@NgModule({
  declarations: [EmailTemplatesPage],
  entryComponents: [EmailTemplatesPage],
  imports: [IonicPageModule.forChild(EmailTemplatesPage), NavModule]
})
export class EmailTemplatesPageModule {}
