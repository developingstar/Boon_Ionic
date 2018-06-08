import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CKEditorModule } from 'ng2-ckeditor'

import { NavModule } from '../nav.module'
import { TextTemplatePage } from './text-template.page'

@NgModule({
  declarations: [TextTemplatePage],
  entryComponents: [TextTemplatePage],
  imports: [
    IonicPageModule.forChild(TextTemplatePage),
    NavModule,
    CKEditorModule
  ]
})
export class TextTemplatePageModule {}
