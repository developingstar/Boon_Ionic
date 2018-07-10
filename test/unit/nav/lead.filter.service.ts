import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { ContactFilterService } from '../../../src/app/nav/contact.filter.service'
import { sampleContact } from '../../support/factories'

describe('ContactFilterService', () => {
  let httpMock: HttpTestingController
  let contactFilterService: ContactFilterService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [contactFilterService]
      })

      httpMock = TestBed.get(HttpTestingController)
      contactFilterService = TestBed.get(ContactFilterService)
    })
  )

  describe('getResults', () => {
    it(
      'returns an array',
      async(() => {
        const contact1 = sampleContact({
          id: 1,
          owner: {
            name: 'Contact Test'
          }
        })

        const contact2 = sampleContact({
          id: 2,
          owner: {
            name: 'Contact Sample'
          }
        })

        const contact3 = sampleContact({
          id: 3,
          owner: {
            name: 'Test Contact'
          }
        })

        contactFilterService.getResults('test').subscribe((result: any[]) => {
          expect(result.length).toEqual(2)
          expect(result).toEqual([
            { id: 1, name: 'Contact Test' },
            { id: 1, name: 'Test Contact' }
          ])
        })

        const req = httpMock.expectOne('/api/contacts?query=test')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            contacts: [
              JSON.parse(JSON.stringify(contact1)),
              JSON.parse(JSON.stringify(contact2)),
              JSON.parse(JSON.stringify(contact3))
            ]
          }
        })

        httpMock.verify()
      })
    )
  })
})
