import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TabActivityComponent } from './tab-activity.component'
import { TabDealsComponent } from './tab-deals.component'
import { TabEmailComponent } from './tab-email.component'
import { TabNotesComponent } from './tab-notes.component'
import { TabSelectorComponent } from './tab-selector.component'
import { TabTextComponent } from './tab-text.component'
import { TabService } from './tab.service'

@NgModule({
  declarations: [
    TabActivityComponent,
    TabDealsComponent,
    TabEmailComponent,
    TabNotesComponent,
    TabSelectorComponent,
    TabTextComponent
  ],
  exports: [
    TabActivityComponent,
    TabDealsComponent,
    TabEmailComponent,
    TabNotesComponent,
    TabSelectorComponent,
    TabTextComponent
  ],
  imports: [CommonModule],
  providers: [TabService]
})
export class ShowTabsComponentsModule {}
