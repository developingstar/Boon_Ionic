import { Component, Input } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'
import { ReactivePage } from '../utils/reactive-page'
import {
  State
} from './integrations.page.state'
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
        { label: 'Twilio', link: 'IntegrationsPage', id: 1 },
        { label: 'Sendgrid', link: 'IntegrationsPage', id: 2 },
        { label: 'Zapier', link: 'IntegrationsPage', id: 3 },
      ],
      id: 1,
      label: 'Integrations',
      link: 'IntegrationsPage',
    },
    {
      children: [
        { label: 'Pipelines', link: 'PipelinesPage' },
        { label: 'Custom Fields', link: 'CustomFieldsPage' }
      ],
      label: 'CMS Settings'
    }
  ]
  constructor(
    private readonly nav: NavController,
    private readonly integrationsService: IntegrationsService
  ) {}

  ngOnInit(): void {
    this.getIntegrationsList()
  }

  getIntegrationsList(): void {
    const listServices = this.integrationsService
      .services()
      .map<ReadonlyArray<Service>, State>((services) => ({
        mode: 'list',
        services: services
      }))
    // listServices.subscribe({
    //   next: (services) => {}
    // })
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

  isActive(entry: IMenuEntry): boolean {
    return (
      this.currentPage === entry.link ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child)))
    )
  }
}
