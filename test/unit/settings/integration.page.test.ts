import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { IntegrationPageObject } from './integration.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { IntegrationPage } from '../../../src/app/settings/integration.page'
import { IntegrationPageModule } from '../../../src/app/settings/integration.page.module'
import { IntegrationsService } from '../../../src/app/settings/integrations.service'
import { Service } from '../../../src/app/settings/service.model'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'

describe('IntegrationPage', () => {
  let fixture: ComponentFixture<IntegrationPage>
  let page: IntegrationPageObject
  let services: Service[]
  let integrationsServiceStub: any
  let toastControllerStub: any
  let toastStub: any

  beforeEach(
    async(() => {
      services = [
        { id: 1, name: 'twilio', token: 'token:secret' },
        { id: 2, name: 'sendgrid', token: 'token' }
      ]

      integrationsServiceStub = {
        createService: (params: Service) => {
          const service = new Service({
            id: 3,
            name: params.name,
            token: params.token
          })
          services.push(service)
          return Observable.of(service)
        },
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
      spyOn(integrationsServiceStub, 'createService').and.callThrough()

      toastStub = {
        present: () => {
          return
        }
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(toastStub, 'present').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()
    })
  )

  describe('create a new service', () => {
    beforeEach(
      async(() => {
        const navParamsStub = {
          get: (prop: string) => 'zapier'
        }

        const currentUserServiceStub = new CurrentUserServiceStub()
        fixture = initComponent(IntegrationPage, {
          imports: [IntegrationPageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: new NavControllerStub() },
            { provide: CurrentUserService, useValue: currentUserServiceStub },
            { provide: NavParams, useValue: navParamsStub },
            { provide: IntegrationsService, useValue: integrationsServiceStub },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new IntegrationPageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('shows a service token', () => {
      expect(page.header).toEqual('zapier')
      expect(page.token).toEqual('')
    })

    it('shows the create button', () => {
      expect(page.createServiceButtonVisible).toBe(true)
      expect(page.updateServiceButtonVisible).toBe(false)
    })

    it('create a service token after clicking the create button', () => {
      page.setToken('created-token')
      fixture.detectChanges()
      page.clickActionButton('Create Token')
      fixture.detectChanges()

      expect(integrationsServiceStub.createService).toHaveBeenCalledWith({
        id: 0,
        name: 'zapier',
        token: 'created-token'
      })
      expect(page.header).toEqual('zapier')
      expect(page.token).toEqual('created-token')
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Created token successfully.'
      })

      expect(page.createServiceButtonVisible).toBe(false)
      expect(page.updateServiceButtonVisible).toBe(true)
    })
  })

  describe('update a existing service', () => {
    beforeEach(
      async(() => {
        const navParamsStub = {
          get: (prop: string) => 'twilio'
        }

        const currentUserServiceStub = new CurrentUserServiceStub()
        fixture = initComponent(IntegrationPage, {
          imports: [IntegrationPageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: new NavControllerStub() },
            { provide: CurrentUserService, useValue: currentUserServiceStub },
            { provide: NavParams, useValue: navParamsStub },
            { provide: IntegrationsService, useValue: integrationsServiceStub },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new IntegrationPageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('shows a service token', () => {
      expect(page.header).toEqual('twilio')
      expect(page.token).toEqual('token:secret')
    })

    it('shows the update button', () => {
      expect(page.createServiceButtonVisible).toBe(false)
      expect(page.updateServiceButtonVisible).toBe(true)
    })

    it('updates a service token after clicking the update button', () => {
      page.setToken('updated-token:secret')
      fixture.detectChanges()
      page.clickActionButton('Update Token')
      fixture.detectChanges()

      expect(integrationsServiceStub.updateService).toHaveBeenCalledWith(1, {
        id: 1,
        name: 'twilio',
        token: 'updated-token:secret'
      })
      expect(page.header).toEqual('twilio')
      expect(page.token).toEqual('updated-token:secret')
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Updated token successfully.'
      })
    })
  })
})
