import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { SendCodePageObject } from './send.code.page.po'

import { AuthService } from '../../../src/app/auth/auth.service'
import { SendCodePage } from '../../../src/app/auth/send.code.page'
import { SendCodePageModule } from '../../../src/app/auth/send.code.page.module'
import { NavService } from '../../../src/app/nav/nav.service'

describe('SendCodePage', () => {
  let fixture: ComponentFixture<SendCodePage>
  let page: SendCodePageObject
  let nextPage: string | undefined
  let navControllerStub: any
  beforeEach(
    async(() => {
      nextPage = undefined

      navControllerStub = {
        setRoot: (newRoot: string) => (nextPage = newRoot)
      }

      const authServiceStub = {
        sendResetRequest: (email: string) => {
          navControllerStub.setRoot('NewPasswordPage')
          return Observable.of(null)
        }
      }

      fixture = initComponent(SendCodePage, {
        imports: [SendCodePageModule],
        providers: [
          NavService,
          { provide: AuthService, useValue: authServiceStub },
          { provide: NavController, useValue: navControllerStub }
        ]
      })

      page = new SendCodePageObject(fixture)
    })
  )

  describe('Send Code Form', () => {
    it('Form UIs are visible', () => {
      fixture.detectChanges()
      expect(page.header).toEqual('Enter account email')
      expect(page.emailInputVisible).toBe(true)
      expect(page.sendCodeButtonVisible).toBe(true)
      expect(page.loginHereVisible).toBe(true)
    })

    it('Submit a form', () => {
      fixture.detectChanges()
      page.setEmail('admin@example.com')
      page.submitForm()

      fixture.detectChanges()

      expect(nextPage).toEqual('NewPasswordPage')
    })

    it('Go to login page', () => {
      page.clickLoginHere()
      fixture.detectChanges()

      expect(nextPage).toEqual('LoginPage')
    })
  })
})
