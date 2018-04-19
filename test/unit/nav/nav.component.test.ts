import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { NavModule } from '../../../src/app/nav.module'
import { NavService } from '../../../src/app/nav/nav.service'
import { initComponent } from '../../support/helpers'
import { TestHostComponent } from './test-host.component'
import { TestHostPageObject } from './test-host.component.po'

describe('NavComponent and NavContentComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let navService: NavService
  let page: TestHostPageObject
  const user: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined)

  beforeEach(
    async(() => {
      user.next(undefined)

      const currentUserServiceStub = {
        details: user
      }

      fixture = initComponent(TestHostComponent, {
        declarations: [TestHostComponent],
        imports: [HttpClientTestingModule, NavModule],
        providers: [
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          NavService
        ]
      })

      navService = fixture.debugElement.injector.get(NavService)
      page = new TestHostPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('renders the center content in the nav', () => {
    fixture.detectChanges()
    expect(page.getNavContent('center')).toBe('center content')
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
      user.next({
        avatar_url: null,
        email: 'john@example.com',
        id: 1,
        name: 'John',
        role: 'admin'
      })

      fixture.detectChanges()

      expect(page.getUsername()).toBe('Hello, John')
    })
  })

  describe('when current user is missing', () => {
    it('does not contain his name', () => {
      fixture.detectChanges()

      expect(page.getUsername()).toBeNull()
    })
  })
})
