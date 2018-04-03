import { ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'

import { SettingsModule } from '../../../src/app/settings.module'
import { SettingsPageWithMenuComponent } from '../../../src/app/settings/settings-page-with-menu.component'

describe('SettingsPageWithMenuComponent', () => {
  let fixture: ComponentFixture<SettingsPageWithMenuComponent>

  const assignCurrentPage = (link: string) => {
    Object.assign(fixture.componentInstance, { currentPage: link })
    fixture.detectChanges()
  }

  beforeEach(() => {
    fixture = initComponent(SettingsPageWithMenuComponent, {
      imports: [SettingsModule],
      providers: [{ provide: NavController, useValue: new NavControllerStub() }]
    })
  })

  it('isActive returns true when top-level link matches', () => {
    const accountSettings = {
      label: 'Account Settings',
      link: 'AccountSettingsPage'
    }

    assignCurrentPage('AccountSettingsPage')

    expect(fixture.componentInstance.isActive(accountSettings)).toBe(true)
  })

  it("isActive returns false when top-level link doesn't match", () => {
    const accountSettings = {
      label: 'Account Settings',
      link: 'AccountSettingsPage'
    }

    assignCurrentPage('BillingSettingsPage')

    expect(fixture.componentInstance.isActive(accountSettings)).toBe(false)
  })

  it('isActive returns true when child link matches', () => {
    const cmsSettings = {
      children: [
        { label: 'Pipelines', link: 'PipelinesPage' },
        { label: 'Custom Fields', link: 'CustomFieldsPage' }
      ],
      label: 'CMS Settings'
    }

    assignCurrentPage('PipelinesPage')

    expect(fixture.componentInstance.isActive(cmsSettings)).toBe(true)
  })
})
