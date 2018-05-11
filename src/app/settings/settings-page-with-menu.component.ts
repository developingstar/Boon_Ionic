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
    readonly id: number
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
    params: { readonly id: number } | undefined
  ): void {
    if (page) {
      if (params) {
        this.nav.setRoot(page, { id: params.id })
      } else {
        this.nav.setRoot(page)
      }
    }
  }

  isActive(entry: IMenuEntry): boolean {
    const pageSubId = Number(this.navParams.get('id'))
    return (
      (this.currentPage === entry.link &&
        (entry.params === undefined || entry.params.id === pageSubId)) ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child)))
    )
  }

  get menu(): Observable<ReadonlyArray<IMenuEntry>> {
    return this.integrationsChildren.map(
      (integrationsChildren: ReadonlyArray<IMenuEntry>) => {
        const firstChild = integrationsChildren[0]
        const childId =
          firstChild !== undefined && firstChild.params !== undefined
            ? firstChild.params.id
            : 1
        return [
          { label: 'Account Settings', link: 'AccountSettingsPage' },
          { label: 'Billing Settings' },
          {
            children: [
              { label: 'Team members', link: 'TeamMembersPage' },
              { label: 'Sales groups', link: 'GroupsPage' }
            ],
            label: 'Team Settings',
            link: 'GroupsPage'
          },
          {
            children: integrationsChildren,
            label: 'Integrations',
            link: 'IntegrationPage',
            params: {
              id: childId
            }
          },
          {
            children: [
              { label: 'Pipelines', link: 'PipelinesPage' },
              { label: 'Custom Fields', link: 'CustomFieldsPage' }
            ],
            label: 'CMS Settings',
            link: 'PipelinesPage'
          }
        ]
      }
    )
  }
}
