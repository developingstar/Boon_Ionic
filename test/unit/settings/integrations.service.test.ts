import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { IntegrationsService } from '../../../src/app/settings/integrations.service'
import { Service } from '../../../src/app/settings/service.model'
import { sampleService } from '../../support/factories'

describe('IntegrationsService', () => {
  let httpMock: HttpTestingController
  let integrationService: IntegrationsService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [IntegrationsService]
      })

      httpMock = TestBed.get(HttpTestingController)
      integrationService = TestBed.get(IntegrationsService)
    })
  )

  describe('services', () => {
    it(
      'returns an array',
      async(() => {
        const twilioService = sampleService()

        const sendgridService = sampleService({
          id: 2,
          name: 'Sendgrid',
          token: 'token'
        })

        integrationService
          .services()
          .subscribe((result: ReadonlyArray<Service>) => {
            expect(result).toEqual([twilioService, sendgridService])
          })

        const req = httpMock.expectOne('/api/services')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            services: [
              JSON.parse(JSON.stringify(twilioService)),
              JSON.parse(JSON.stringify(sendgridService))
            ]
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('service', () => {
    it(
      'returns a service',
      async(() => {
        const twilioService = sampleService()

        integrationService.service(1).subscribe((service) => {
          expect(service.id).toEqual(1)
          expect(service.name).toEqual('Twilio')
          expect(service.token).toEqual('secret:token')
        })

        const req = httpMock.expectOne('/api/services/1')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            service: twilioService
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('createService', () => {
    it(
      'returns the created service',
      async(() => {
        const twilioService = sampleService()

        integrationService.createService(twilioService).subscribe((service) => {
          expect(service.name).toEqual('Twilio')
          expect(service.token).toEqual('secret:token')
        })

        const req = httpMock.expectOne('/api/services')
        expect(req.request.method).toBe('POST')

        req.flush({
          data: {
            service: twilioService
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('updateService', () => {
    it(
      'returns the updated service',
      async(() => {
        const twilioService = sampleService()

        integrationService
          .updateService(1, twilioService)
          .subscribe((service) => {
            expect(service.id).toEqual(1)
            expect(service.name).toEqual('Twilio')
            expect(service.token).toEqual('secret:token')
          })

        const req = httpMock.expectOne('/api/services/1')
        expect(req.request.method).toBe('PATCH')

        req.flush({
          data: {
            service: twilioService
          }
        })

        httpMock.verify()
      })
    )
  })
})
