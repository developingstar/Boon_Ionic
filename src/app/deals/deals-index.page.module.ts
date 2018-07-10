import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavModule } from '../nav.module'
import { DealsIndexPage } from './deals-index.page'
import { DealsComponentsModule } from './deals.components.module'

@NgModule({
  declarations: [DealsIndexPage],
  entryComponents: [DealsIndexPage],
  imports: [
    NgSelectModule,
    FormsModule,
    InlineSVGModule,
    IonicPageModule.forChild(DealsIndexPage),
    NavModule,
    DealsComponentsModule
  ]
})
export class DealsIndexPageModule {}
