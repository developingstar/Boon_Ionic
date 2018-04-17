import { Component, Input } from '@angular/core'
import { NavController } from 'ionic-angular'

interface IMenuEntry {
  readonly children?: ReadonlyArray<IMenuEntry>
  readonly label: string
  readonly link?: string
}

@Component({
  selector: 'settings-page-with-menu',
  templateUrl: 'settings-page-with-menu.component.html'
})
export class SettingsPageWithMenuComponent {
  @Input() readonly currentPage: string

  readonly menu: ReadonlyArray<IMenuEntry> = [
    { label: 'Account Settings', link: 'AccountSettingsPage' },
    { label: 'Billing Settings' },
    {
      children: [
        { label: 'Team members' },
        { label: 'Sales groups', link: 'GroupsPage' }
      ],
      label: 'Team Settings',
      link: 'GroupsPage'
    },
    {
      children: [{ label: 'Twilio' }, { label: 'Zapier' }],
      label: 'Integrations'
    },
    {
      children: [
        { label: 'Pipelines', link: 'PipelinesPage' },
        { label: 'Custom Fields', link: 'CustomFieldsPage' }
      ],
      label: 'CMS Settings'
    }
  ]

  constructor(private readonly nav: NavController) {}

  goTo(page: string | undefined): void {
    if (page) {
      this.nav.setRoot(page)
    }
  }

  isActive(entry: IMenuEntry): boolean {
    return (
      this.currentPage === entry.link ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child)))
    )
  }
}
