import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { Deal } from '../../../src/app/deals/deal.model'
import { DealsService } from '../../../src/app/deals/deals.service'
import { sampleDeal } from '../../support/factories'
import { PaginatedList } from './../../../src/app/api/paginated-list'

describe('DealsService', () => {
  let httpMock: HttpTestingController
  let service: DealsService
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [DealsService]
      })
      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(DealsService)
    })
  )
  describe('deals', () => {
    it(
      'returns an API collection',
      async(() => {
        const deal = sampleDeal()
        service.deals().subscribe((result: PaginatedList<Deal>) => {
          expect(result.nextPageLink).toEqual('http://example.com/next')
          expect(result.prevPageLink).toEqual('http://example.com/prev')
          expect(result.items[0]).toEqual(new Deal(deal))
          expect(result.items[0] instanceof Deal).toBeTruthy()
          expect(result.items.length).toEqual(1)
        })
        const req = httpMock.expectOne('/api/deals?per_page=50')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            deals: [JSON.parse(JSON.stringify(deal))]
          },
          links: {
            next: 'http://example.com/next',
            prev: 'http://example.com/prev'
          }
        })
        httpMock.verify()
      })
    )
    it(
      'allows to use a custom URL',
      async(() => {
        const url = 'http://example.com/api/deals?cursor=10'
        service.deals(url).subscribe()
        const req = httpMock.expectOne(url)
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            deals: []
          },
          links: {
            next: null,
            prev: null
          }
        })
        httpMock.verify()
      })
    )
  })
})
