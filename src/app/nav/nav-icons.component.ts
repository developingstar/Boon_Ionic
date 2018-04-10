import { Component, Input } from '@angular/core'
import { NavController } from 'ionic-angular'

interface IPageGroup {
  readonly icon: string
  readonly pages: ReadonlyArray<string>
}

// Main navigation icons that appear on all pages.
//
// This should be used inside "right" section of the nav-content.
@Component({
  selector: 'nav-icons',
  templateUrl: 'nav-icons.component.html'
})
export class NavIconsComponent {
  @Input() readonly currentPage: string

  readonly pageGroups: ReadonlyArray<IPageGroup> = [
    { icon: 'crm.svg', pages: ['CrmPage', 'LeadPage'] },
    { icon: 'automation.svg', pages: ['JourneysPage', 'JourneyPage'] },
    { icon: 'email.svg', pages: ['TemplatesPage'] },
    { icon: 'settings.svg', pages: ['PipelinesPage', 'CustomFieldsPage'] }
  ]

  constructor(private readonly nav: NavController) {}

  goTo(pageGroup: IPageGroup): void {
    this.nav.setRoot(pageGroup.pages[0])
  }

  iconClass(pageGroup: IPageGroup): string {
    return this.isActive(pageGroup) ? 'nav-icon-link-active' : 'nav-icon-link'
  }

  private isActive(pageGroup: IPageGroup): boolean {
    return pageGroup.pages.indexOf(this.currentPage) !== -1
  }
}
