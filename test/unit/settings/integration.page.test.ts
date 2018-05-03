import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { IntegrationPageObject } from './integration.page.po'

import { NavService } from '../../../src/app/nav/nav.service'
import { IntegrationPage } from '../../../src/app/settings/integration.page'
import { IntegrationPageModule } from '../../../src/app/settings/integration.page.module'
import { IntegrationsService } from '../../../src/app/settings/integrations.service'
import { Service } from '../../../src/app/settings/service.model'

describe('IntegrationPage', () => {
  let fixture: ComponentFixture<IntegrationPage>
  let page: IntegrationPageObject
  let services: Service[]
  let integrationsServiceStub: any
  beforeEach(async(() => {
    services = [
      { id: 1, name: 'Twilio', token: 'token:secret' },
      { id: 2, name: 'Sendgrid', token: 'token' }
    ]

    integrationsServiceStub = {
      service: (id: number) => {
        const service = services.find((s) => s.id === id)
        return Observable.of(service)
      },
      services: () => Observable.of(services),
      updateService: (id: number, params: Service) => {
        const service = services.find((s) => s.id === id)
        if (service === undefined) {
          return Observable.of(undefined)
        } else {
          return Observable.of({
            ...service,
            ...params
          })
        }
      }
    }

    spyOn(integrationsServiceStub, 'service').and.callThrough()
    spyOn(integrationsServiceStub, 'updateService').and.callThrough()

    const navParamsStub = {
      get: (prop: string) => 1
    }

    fixture = initComponent(IntegrationPage, {
      imports: [IntegrationPageModule, HttpClientTestingModule],
      providers: [
        NavService,
        { provide: NavController, useValue: new NavControllerStub() },
        { provide: NavParams, useValue: navParamsStub },
        { provide: IntegrationsService, useValue: integrationsServiceStub }
      ]
    })

    page = new IntegrationPageObject(fixture)

    fixture.detectChanges()
  }))

  describe('show service', () => {
    it('shows a service token', () => {
      expect(page.header).toEqual('Twilio')
      expect(page.token).toEqual('token:secret')
    })
    it('shows the update button', () => {
      expect(page.updateServiceButtonVisible).toBe(true)
    })

    it('updates a service token after clicking the update button', () => {
      page.setToken('updated-token:secret')
      fixture.detectChanges()
      page.clickUpdateButton()
      fixture.detectChanges()

      expect(integrationsServiceStub.updateService).toHaveBeenCalledWith(1, {
        id: 1,
        name: 'Twilio',
        token: 'updated-token:secret'
      })
      expect(page.header).toEqual('Twilio')
      expect(page.token).toEqual('updated-token:secret')
    })
  })
})
