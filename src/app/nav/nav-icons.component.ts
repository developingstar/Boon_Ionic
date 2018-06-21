import { Component, Input } from '@angular/core'
import { NavController } from 'ionic-angular'

import { CurrentUserService } from '../auth/current-user.service'
import { navAccess } from '../utils/app-access'

interface INavGroup {
  readonly name: string
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

  currentUserRole: Auth.API.Role | undefined

  readonly navGroups: ReadonlyArray<INavGroup> = [
    {
      icon: 'Dashboard.svg',
      name: 'Crm',
      pages: ['CrmPage', 'LeadPage']
    },
    {
      icon: 'crm.svg',
      name: 'Deals',
      pages: ['DealsShowPage', 'DealsIndexPage']
    },
    {
      icon: 'automation.svg',
      name: 'Automation',
      pages: ['JourneysPage', 'JourneyPage']
    },
    {
      icon: 'text.svg',
      name: 'Text',
      pages: ['TextTemplatesPage']
    },
    {
      icon: 'email.svg',
      name: 'Email',
      pages: ['EmailTemplatesPage']
    },
    {
      icon: 'settings.svg',
      name: 'Settings',
      pages: ['PipelinesPage', 'CustomFieldsPage', 'IntegrationPage']
    }
  ]

  constructor(
    private readonly nav: NavController,
    private currentUserService: CurrentUserService
  ) {
    this.currentUserService.role().subscribe((role) => {
      this.currentUserRole = role
    })
  }

  goTo(navGroup: INavGroup): void {
    this.nav.setRoot(navGroup.pages[0])
  }

  iconClass(navGroup: INavGroup): string {
    return this.isActive(navGroup) ? 'nav-icon-link-active' : 'nav-icon-link'
  }

  userHasNavAccess(navGroup: INavGroup): boolean {
    return navAccess(this.currentUserRole)[navGroup.name] !== undefined
  }

  private isActive(navGroup: INavGroup): boolean {
    return navGroup.pages.indexOf(this.currentPage) !== -1
  }
}
