import { async, TestBed } from '@angular/core/testing'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'

describe('CurrentUserService', () => {
  let service: CurrentUserService
  const userDetails: User = new User({
    avatar_url: null,
    email: 'john@example.com',
    id: 100,
    name: 'John Boon',
    password: '',
    phone_number: '',
    role: 'admin'
  })

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CurrentUserService]
      })

      service = TestBed.get(CurrentUserService)
    })
  )

  describe('details', () => {
    it(
      'is initialized with undefined',
      async(() => {
        service.details.subscribe((details) => {
          expect(details).toBeUndefined()
        })
      })
    )

    it(
      'returns current value',
      async(() => {
        service.details.next(userDetails)

        service.details.subscribe((details) => {
          expect(details).toEqual(userDetails)
        })
      })
    )

    it(
      'stores data in cache on new details',
      async(() => {
        spyOn(localStorage, 'setItem')

        service.details.next(userDetails)

        service.details.subscribe((details: User) => {
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'user',
            JSON.stringify(details)
          )
        })
      })
    )

    it(
      'removes the cache when details subject is set to undefined',
      async(() => {
        spyOn(localStorage, 'removeItem')

        service.details.next(undefined)

        service.details.subscribe((details: User) => {
          expect(localStorage.removeItem).toHaveBeenCalledWith('user')
        })
      })
    )
  })

  describe('isAuthenticated', () => {
    it(
      'returns async false on missing details',
      async(() => {
        service.details.next(undefined)

        service.isAuthenticated().subscribe((isAuthenticated) => {
          expect(isAuthenticated).toEqual(false)
        })
      })
    )

    it(
      'returns async true when details are set',
      async(() => {
        service.details.next(userDetails)

        service.isAuthenticated().subscribe((isAuthenticated) => {
          expect(isAuthenticated).toEqual(true)
        })
      })
    )
  })
})
