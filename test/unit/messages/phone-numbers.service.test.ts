import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { PhoneNumbersService } from '../../../src/app/messages/phone-numbers.service'

describe('PhoneNumbersService', () => {
  let httpMock: HttpTestingController
  let service: PhoneNumbersService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [PhoneNumbersService]
      })

      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(PhoneNumbersService)
    })
  )

  describe('getAll', () => {
    it(
      'returns all phone numbers',
      async(() => {
        service.getAll().subscribe((phoneNumbers) => {
          expect(phoneNumbers.length).toEqual(3)
          expect(phoneNumbers[0]).toEqual('+999111111')
          expect(phoneNumbers[1]).toEqual('+999222222')
          expect(phoneNumbers[2]).toEqual('+999333333')
        })

        const req = httpMock.expectOne('/api/phone_numbers')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            phone_numbers: [
              {
                phone_number: '+999111111'
              },
              {
                phone_number: '+999222222'
              },
              {
                phone_number: '+999333333'
              }
            ]
          }
        })

        httpMock.verify()
      })
    )

    it(
      'ensures valid phone numbers',
      async(() => {
        expect(() => {
          service.getAll().subscribe()

          const req = httpMock.expectOne('/api/phone_numbers')
          expect(req.request.method).toBe('GET')

          req.flush({
            data: {
              phone_numbers: [
                {
                  phone_number: '+999111111'
                },
                {
                  phone_number: '+999 111 111'
                }
              ]
            }
          })

          httpMock.verify()
        }).toThrow(new Error('Expected +999 111 111 to be a phone number'))
      })
    )
  })
})
