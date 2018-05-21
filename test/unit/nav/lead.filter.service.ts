import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { LeadFilterService } from '../../../src/app/nav/lead.filter.service'
import { sampleLead } from '../../support/factories'

describe('LeadFilterService', () => {
  let httpMock: HttpTestingController
  let leadFilterService: LeadFilterService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [leadFilterService]
      })

      httpMock = TestBed.get(HttpTestingController)
      leadFilterService = TestBed.get(LeadFilterService)
    })
  )

  describe('getResults', () => {
    it(
      'returns an array',
      async(() => {
        const lead1 = sampleLead({
          id: 1,
          owner: {
            name: 'Lead Test'
          }
        })

        const lead2 = sampleLead({
          id: 2,
          owner: {
            name: 'Lead Sample'
          }
        })

        const lead3 = sampleLead({
          id: 3,
          owner: {
            name: 'Test Lead'
          }
        })

        leadFilterService.getResults('test').subscribe((result: any[]) => {
          expect(result.length).toEqual(2)
          expect(result).toEqual([
            { id: 1, name: 'Lead Test' },
            { id: 1, name: 'Test Lead' }
          ])
        })

        const req = httpMock.expectOne('/api/leads?query=test')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            leads: [
              JSON.parse(JSON.stringify(lead1)),
              JSON.parse(JSON.stringify(lead2)),
              JSON.parse(JSON.stringify(lead3))
            ]
          }
        })

        httpMock.verify()
      })
    )
  })
})
