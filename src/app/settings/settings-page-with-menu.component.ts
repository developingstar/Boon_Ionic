import { Component, Input } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { IntegrationsService } from './integrations.service'
import { Service } from './service.model'

interface IMenuEntry {
  readonly children?: ReadonlyArray<IMenuEntry>
  readonly label: string
  readonly link?: string
  readonly params?: {
    readonly id?: number
    readonly name?: string
  }
}

@Component({
  selector: 'settings-page-with-menu',
  templateUrl: 'settings-page-with-menu.component.html'
})

export class SettingsPageWithMenuComponent {
  @Input() readonly currentPage: string

  private readonly integrationsChildren: Observable<ReadonlyArray<IMenuEntry>>
  private readonly integrationsSubscription: Subscription

  constructor(
    private navParams: NavParams,
    private readonly nav: NavController,
    private readonly integrationsService: IntegrationsService
  ) {
    this.integrationsChildren = this.integrationsService
      .services()
      .map((services: ReadonlyArray<Service>) => {
        return services.map((service) => ({
          label: service.name,
          link: 'IntegrationPage',
          params: { id: service.id }
        }))
      })
      .shareReplay(1)
    this.integrationsSubscription = this.integrationsChildren.subscribe()
  }

  ngOnDestroy(): void {
    if (this.integrationsSubscription) {
      this.integrationsSubscription.unsubscribe()
    }
  }

  goTo(
    page: string | undefined,
    params: { readonly id?: number; readonly name?: string } | undefined
  ): void {
    if (page) {
      if (params) {
        if (params.id) {
          this.nav.setRoot(page, { id: params.id })
        } else {
          this.nav.setRoot(page, { name: params.name })
        }
      } else {
        this.nav.setRoot(page)
      }
    }
  }

  isActive(entry: IMenuEntry): boolean {
    const pageSubId = Number(this.navParams.get('id'))
    const pageSubName = this.navParams.get('name')
    return (
      (this.currentPage === entry.link &&
        (entry.params === undefined ||
          entry.params.id === pageSubId ||
          entry.params.name === pageSubName)) ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child)))
    )
  }

  get menu(): Observable<ReadonlyArray<IMenuEntry>> {
    return Observable.of([
      { label: 'Account Settings', link: 'AccountSettingsPage' },
      { label: 'Billing Settings' },
      {
        children: [
          { label: 'Team members', link: 'TeamMembersPage' },
          { label: 'Sales groups', link: 'GroupsPage' }
        ],
        label: 'Team Settings',
        link: 'TeamMembersPage'
      },
      {
        children: [
          {
            label: 'Twilio',
            link: 'IntegrationPage',
            params: { name: 'twilio' }
          },
          {
            label: 'Sendgrid',
            link: 'IntegrationPage',
            params: { name: 'sendgrid' }
          },
          {
            label: 'Zapier',
            link: 'IntegrationPage',
            params: { name: 'zapier' }
          }
        ],
        label: 'Integrations',
        link: 'IntegrationPage',
        params: {
          name: 'twilio'
        }
      },
      {
        children: [
          { label: 'Pipelines', link: 'PipelinesPage' },
          { label: 'Custom Fields', link: 'CustomFieldsPage' }
        ],
        label: 'CRM Settings',
        link: 'PipelinesPage'
      }
    ])
  }
}
