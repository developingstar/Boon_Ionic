import { Component, Input } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { IntegrationsService } from './integrations.service'
import { Service } from './service.model'

interface IMenuEntry {
  readonly children?: ReadonlyArray<IMenuEntry>
  readonly label: string
  readonly link?: string
  readonly id?: number
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
      children: [{ label: 'Team members' }, { label: 'Sales groups' }],
      label: 'Team Settings'
    },
    {
      children: [
        { label: 'Twilio', link: 'IntegrationPage', id: 1 },
        { label: 'Sendgrid', link: 'IntegrationPage', id: 2 },
        { label: 'Zapier', link: 'IntegrationPage', id: 3 },
      ],
      id: 1,
      label: 'Integrations',
      link: 'IntegrationPage',
    },
    {
      children: [
        { label: 'Pipelines', link: 'PipelinesPage' },
        { label: 'Custom Fields', link: 'CustomFieldsPage' }
      ],
      label: 'CMS Settings',
      link: 'PipelinesPage',
    }
  ]
  constructor(
    private readonly nav: NavController,
    private navParams: NavParams,
    private readonly integrationsService: IntegrationsService
  ) {}

  ngOnInit(): void {
    this.getMenus()
  }

  goTo(page: string | undefined, id: number | undefined): void {
    if (page) {
      if (id) {
        this.nav.setRoot(page, { id: id })
      } else {
        this.nav.setRoot(page)
      }
    }
  }

  isActive(entry: IMenuEntry, id: number | undefined): boolean {
    const serviceID = Number(this.navParams.get('id'))
    return (
      (this.currentPage === entry.link && (id === undefined || id === serviceID)) ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child, child.id)))
    )
  }

  private getMenus(): void {
    const listMenus = this.integrationsService.services().map((services: ReadonlyArray<Service>) => {
      return services.map((service) => ({
        id: service.id,
        link: 'IntegrationPage',
        name: service.name
      }))
    }).map((services) => {
      return [
        { label: 'Account Settings', link: 'AccountSettingsPage' },
        { label: 'Billing Settings' },
        {
          children: [{ label: 'Team members' }, { label: 'Sales groups' }],
          label: 'Team Settings'
        },
        {
          children: services,
          id: services[0].id,
          label: 'Integrations',
          link: 'IntegrationPage',
        },
        {
          children: [
            { label: 'Pipelines', link: 'PipelinesPage' },
            { label: 'Custom Fields', link: 'CustomFieldsPage' }
          ],
          label: 'CMS Settings'
        }
      ]
    })
  }
}
