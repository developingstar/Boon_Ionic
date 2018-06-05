import { NgModule } from '@angular/core'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg'
import { IonicPageModule } from 'ionic-angular'

import { NavModule } from '../nav.module'
import { EmailTemplatePage } from './email-template.page'

import 'froala-editor/js/froala_editor.pkgd.min.js'
@NgModule({
  declarations: [EmailTemplatePage],
  entryComponents: [EmailTemplatePage],
  imports: [IonicPageModule.forChild(EmailTemplatePage), NavModule, FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()]
})
export class EmailTemplatePageModule {}
