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
import { sampleService } from '../../support/factories'

describe('PipelinesPage', () => {
  let fixture: ComponentFixture<IntegrationPage>
  let page: IntegrationPageObject
  let twilioService: Service
  let integrationsServiceStub: any

  beforeEach(
    async(() => {

      integrationsServiceStub = {
        service: (id: number) => {
          twilioService = new Service({
            id: 1,
            name: 'Twilio',
            token: 'secret:token'
          })
          return Observable.of(twilioService)
        },
        updateService: (id: number, service: Service) => {
          if (twilioService.id === id) {
            twilioService = {...twilioService, token: service.token}
          }
          return Observable.of(twilioService)
        }
      }

      spyOn(integrationsServiceStub, 'service').and.callThrough()
      spyOn(integrationsServiceStub, 'updateService').and.callThrough()

      const navParamsStub = {
        get: (prop: string) => prop
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
    })
  )
})
