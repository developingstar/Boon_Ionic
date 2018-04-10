import { Component, Input, OnDestroy } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

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
          id: service.id,
          label: service.name,
          link: 'IntegrationPage'
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
      (this.currentPage === entry.link &&
        (id === undefined || id === serviceID)) ||
      (entry.children !== undefined &&
        entry.children.some((child) => this.isActive(child, child.id)))
    )
  }

  get menu(): Observable<ReadonlyArray<IMenuEntry>> {
    return this.integrationsChildren.map((integrationsChildren) => [
      { label: 'Account Settings', link: 'AccountSettingsPage' },
      { label: 'Billing Settings' },
      {
        children: [{ label: 'Team members' }, { label: 'Sales groups' }],
        label: 'Team Settings'
      },
      {
        children: integrationsChildren,
        id: integrationsChildren[0].id,
        label: 'Integrations',
        link: 'IntegrationPage'
      },
      {
        children: [
          { label: 'Pipelines', link: 'PipelinesPage' },
          { label: 'Custom Fields', link: 'CustomFieldsPage' }
        ],
        label: 'CMS Settings'
      }
    ])
  }
}
