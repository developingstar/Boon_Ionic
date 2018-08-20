import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { UsersService } from '../../../src/app/crm/users.service'

describe('UsersService', () => {
  let httpMock: HttpTestingController
  let service: UsersService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [UsersService]
      })

      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(UsersService)
    })
  )

  describe('users', () => {
    it(
      'returns all users',
      async(() => {
        service.users().subscribe((users) => {
          expect(users.length).toEqual(2)
          expect(users[0].id).toEqual(11)
          expect(users[0].name).toEqual('John Boon')
          expect(users[0].email).toEqual('john@example.com')
          expect(users[0].role).toEqual('admin')
          expect(users[1].id).toEqual(12)
          expect(users[1].name).toEqual('Mark Boon')
          expect(users[1].email).toEqual('mark@example.com')
          expect(users[1].role).toEqual('sales_rep')
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
                role: 'sales_rep'
              }
            ]
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('user', () => {
    it(
      'returns a user',
      async(() => {
        service.user(1).subscribe((user) => {
          expect(user.id).toEqual(11)
          expect(user.name).toEqual('John Boon')
          expect(user.email).toEqual('john@example.com')
          expect(user.role).toEqual('admin')
        })

        const req = httpMock.expectOne('/api/users/1')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            user: {
              email: 'john@example.com',
              id: 11,
              name: 'John Boon',
              role: 'admin'
            }
          }
        })

        httpMock.verify()
      })
    )
  })
})
