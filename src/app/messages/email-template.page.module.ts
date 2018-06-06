import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CKEditorModule } from 'ng2-ckeditor'

import { NavModule } from '../nav.module'
import { EmailTemplatePage } from './email-template.page'

@NgModule({
  declarations: [EmailTemplatePage],
  entryComponents: [EmailTemplatePage],
  imports: [
    IonicPageModule.forChild(EmailTemplatePage),
    NavModule,
    CKEditorModule
  ]
})
export class EmailTemplatePageModule {}
