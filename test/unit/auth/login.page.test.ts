import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { LoginPageObject } from './login.page.po'

import { AuthService } from '../../../src/app/auth/auth.service'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { LoginPage } from '../../../src/app/auth/login.page'
import { LoginPageModule } from '../../../src/app/auth/login.page.module'
import { NavService } from '../../../src/app/nav/nav.service'

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>
  let page: LoginPageObject
  let isAuthenticated: boolean
  let nextPage: string | undefined

  beforeEach(
    async(() => {
      nextPage = undefined

      const authServiceStub = {
        login: (email: string, password: string) => (isAuthenticated = true)
      }

      const currentUserServiceStub = {
        isAuthenticated: (): Observable<boolean> =>
          Observable.of(isAuthenticated)
      }

      const navControllerStub = {
        setRoot: (newRoot: string) => (nextPage = newRoot)
      }

      fixture = initComponent(LoginPage, {
        imports: [LoginPageModule],
        providers: [
          NavService,
          { provide: AuthService, useValue: authServiceStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavController, useValue: navControllerStub }
        ]
      })

      page = new LoginPageObject(fixture)
    })
  )

  describe('when user is unauthenticated', () => {
    it('includes a login form', () => {
      isAuthenticated = false
      fixture.detectChanges()

      page.setEmail('admin@example.com')
      page.setPassword('secret')
      page.submitForm()

      fixture.detectChanges()

      expect(isAuthenticated).toEqual(true)
    })

    it('forgot a password click', () => {
      isAuthenticated = false
      fixture.detectChanges()

      expect(page.forgotButtonVisible).toBe(true)

      page.clickForgotPassword()
      fixture.detectChanges()

      expect(nextPage).toEqual('SendCodePage')
    })
  })

  describe('when user is authenticated', () => {
    it('sets a new root for redirection', () => {
      isAuthenticated = true
      fixture.detectChanges()
      expect(nextPage).toEqual('CrmPage')
    })
  })
})
