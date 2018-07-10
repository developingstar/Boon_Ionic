import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { AuthService } from '../../../src/app/auth/auth.service'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { sampleUser } from '../../support/factories'

describe('AuthService', () => {
  let currentUserService: CurrentUserService
  let httpMock: HttpTestingController
  let service: AuthService

  const userDetails: User = new User(sampleUser())

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService, CurrentUserService]
      })

      currentUserService = TestBed.get(CurrentUserService)
      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(AuthService)
    })
  )

  describe('login', () => {
    describe('on valid credentials', () => {
      it(
        'sets user details',
        async(() => {
          currentUserService.details.next(undefined)

          service.login('john@example.com', 'secret').add(() => {
            currentUserService.details.subscribe((details) => {
              expect(details).toEqual(userDetails)
            })
          })

          const req = httpMock.expectOne(`/api/sessions`)
          expect(req.request.method).toBe('POST')

          req.flush({
            data: {
              user: userDetails.toApiRepresentation()
            }
          })

          httpMock.verify()
        })
      )
    })
  })

  describe('logout', () => {
    it(
      `sets user details to undefined`,
      async(() => {
        currentUserService.details.next(userDetails)
        service.logout()

        currentUserService.details.subscribe((details) => {
          expect(details).toBeUndefined()
        })
      })
    )
  })

  describe('reset password', () => {
    it(
      'send reset request',
      async(() => {
        service.sendResetRequest('admin@example.com').subscribe((result) => {
          expect(result.data.message).toEqual('OK')
        })

        const req = httpMock.expectOne('/api/users/request-password-reset')
        expect(req.request.method).toBe('POST')

        req.flush({
          data: {
            message: 'OK'
          }
        })

        httpMock.verify()
      })
    )

    it(
      'create new password',
      async(() => {
        service
          .createNewPassword('token_code', 'new_password')
          .subscribe((result) => {
            expect(result.data.message).toEqual('OK')
          })

        const req = httpMock.expectOne('/api/users/reset-password')
        expect(req.request.method).toBe('POST')

        req.flush({
          data: {
            message: 'OK'
          }
        })

        httpMock.verify()
      })
    )
  })
})
