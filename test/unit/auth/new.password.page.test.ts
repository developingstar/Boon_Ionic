import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NewPasswordPageObject } from './new.password.page.po'

import { AuthService } from '../../../src/app/auth/auth.service'
import { NewPasswordPage } from '../../../src/app/auth/new.password.page'
import { NewPasswordPageModule } from '../../../src/app/auth/new.password.page.module'
import { NavService } from '../../../src/app/nav/nav.service'

describe('NewPasswordPage', () => {
  let fixture: ComponentFixture<NewPasswordPage>
  let page: NewPasswordPageObject
  let nextPage: string | undefined
  let navControllerStub: any
  beforeEach(
    async(() => {
      nextPage = undefined

      navControllerStub = {
        setRoot: (newRoot: string) => (nextPage = newRoot)
      }

      const authServiceStub = {
        createNewPassword: (token: string, password: string) => {
          navControllerStub.setRoot('LoginPage')
          return Observable.of(null)
        }
      }

      fixture = initComponent(NewPasswordPage, {
        imports: [NewPasswordPageModule],
        providers: [
          NavService,
          { provide: AuthService, useValue: authServiceStub },
          { provide: NavController, useValue: navControllerStub }
        ]
      })

      page = new NewPasswordPageObject(fixture)
    })
  )

  describe('Send Code Form', () => {
    it('Form UIs are visible', () => {
      fixture.detectChanges()
      expect(page.header).toEqual('Create new password')
      expect(page.codeInputVisible).toBe(true)
      expect(page.newPasswordInputVisible).toBe(true)
      expect(page.confirmPasswordInputVisible).toBe(true)
      expect(page.loginHereVisible).toBe(true)
    })

    it('Submit a form', () => {
      fixture.detectChanges()
      page.setInputValue('code', 'token')
      page.setInputValue('new-password', 'password')
      page.setInputValue('confirm-password', 'password')
      page.submitForm()

      fixture.detectChanges()

      expect(nextPage).toEqual('LoginPage')
    })

    it('Go to login page', () => {
      page.clickLoginHere()
      fixture.detectChanges()

      expect(nextPage).toEqual('LoginPage')
    })
  })
})
