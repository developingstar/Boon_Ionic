import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { UserService } from '../../../src/app/auth/user.service'

describe('UsersService', () => {
  let httpMock: HttpTestingController
  let service: UserService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    })

    httpMock = TestBed.get(HttpTestingController)
    service = TestBed.get(UserService)
  }))

  describe('users', () => {
    it('returns all users', async(() => {
      service.users().subscribe((users) => {
        expect(users.length).toEqual(2)
        expect(users[0].id).toEqual(11)
        expect(users[0].name).toEqual('John Boon')
        expect(users[0].email).toEqual('john@example.com')
        expect(users[0].role).toEqual('admin')
        expect(users[1].id).toEqual(12)
        expect(users[1].name).toEqual('Mark Boon')
        expect(users[1].email).toEqual('mark@example.com')
        expect(users[1].role).toEqual('lead_owner')
      })

      const req = httpMock.expectOne('/api/users')
      expect(req.request.method).toBe('GET')

      req.flush({
        data: {
          users: [
            {
              email: 'john@example.com',
              id: 11,
              name: 'John Boon',
              role: 'admin'
            },
            {
              email: 'mark@example.com',
              id: 12,
              name: 'Mark Boon',
              role: 'lead_owner'
            }
          ]
        }
      })

      httpMock.verify()
    }))
  })
})
