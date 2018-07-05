import { Component, Input } from '@angular/core'

@Component({
  selector: 'tab-selector',
  templateUrl: 'tab-selector.component.html'
})
export class TabSelectorComponent {
  @Input() tabs: TabTypes[]
  @Input() selectedTab: TabTypes

  isSelected(tab: TabTypes): boolean {
    return this.selectedTab === tab
  }

  selectTab(tab: TabTypes): void {
    this.selectedTab = tab
  }
}

export type TabTypes = 'Activity' | 'Notes' | 'Texting' | 'Email' | 'Deals'
