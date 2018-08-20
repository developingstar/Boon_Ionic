import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { NavModule } from '../../../src/app/nav.module'
import { ContactFilterService } from '../../../src/app/nav/contact.filter.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { initComponent } from '../../support/helpers'
import { TestHostComponent } from './test-host.component'
import { TestHostPageObject } from './test-host.component.po'

describe('NavComponent and NavContentComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let filterContactServiceStub: any
  let navService: NavService
  let page: TestHostPageObject
  const user: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined)
  let filteredContacts: any[]

  beforeEach(
    async(() => {
      user.next(undefined)
      filteredContacts = [
        { id: 1, name: 'Test Contact' },
        { id: 2, name: 'Contact Test' }
      ]
      const currentUserServiceStub = {
        details: user
      }

      filterContactServiceStub = {
        getResults: (contactName: string) => {
          return filteredContacts
        }
      }

      spyOn(filterContactServiceStub, 'getResults').and.callThrough()

      fixture = initComponent(TestHostComponent, {
        declarations: [TestHostComponent],
        imports: [HttpClientTestingModule, NavModule],
        providers: [
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: ContactFilterService, useValue: filterContactServiceStub },
          NavService
        ]
      })

      navService = fixture.debugElement.injector.get(NavService)
      page = new TestHostPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('renders auto-complete component in the nav', () => {
    fixture.detectChanges()
    expect(page.autoCompleteComponentVisible()).toBe(true)
  })

  it('renders the right content in the nav', () => {
    fixture.detectChanges()
    expect(page.getNavContent('right')).toBe('right content')
  })

  it('can toggle nav bar visibility', () => {
    navService.navBarVisible.next(false)
    fixture.detectChanges()
    expect(page.isNavHidden()).toBe(true)

    navService.navBarVisible.next(true)
    fixture.detectChanges()
    expect(page.isNavHidden()).toBe(false)
  })

  describe('when current user is set', () => {
    it('renders his name', () => {
      user.next(
        new User({
          avatar_url: '',
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        })
      )

      fixture.detectChanges()

      expect(page.getUsername()).toBe('Hello, John Boon')
    })
  })

  describe('when current user is missing', () => {
    it('does not contain his name', () => {
      fixture.detectChanges()

      expect(page.getUsername()).toBeNull()
    })
  })

  describe('filter contact', () => {
    it(
      'shows a list of filtered contacts',
      fakeAsync(() => {
        page.setContactName('Test')
        fixture.detectChanges()
        tick(2000)
      })
    )
  })
})
