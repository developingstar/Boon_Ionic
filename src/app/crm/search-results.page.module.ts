import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { CrmModule } from '../crm.module'

import { NavModule } from '../nav.module'
import { SearchResultsPage } from './search-results.page'

@NgModule({
  declarations: [SearchResultsPage],
  entryComponents: [SearchResultsPage],
  imports: [
    InlineSVGModule,
    IonicPageModule.forChild(SearchResultsPage),
    NavModule,
    CrmModule
  ]
})
export class SearchResultsPageModule {}
