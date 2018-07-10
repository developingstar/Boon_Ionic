import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, ToastController, ViewController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { SignupPageObject } from './signup.page.po'

import { AuthService } from '../../../src/app/auth/auth.service'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { SignupPage } from '../../../src/app/auth/signup.page'
import { SignupPageModule } from '../../../src/app/auth/signup.page.module'
import { NavService } from '../../../src/app/nav/nav.service'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'
import { sampleUser } from '../../support/factories'

describe('SignupPage', () => {
  let fixture: ComponentFixture<SignupPage>
  let page: SignupPageObject
  let isAuthenticated: boolean
  let nextPage: string | undefined
  let authServiceStub: any
  let viewControllerStub: any
  let toastControllerStub: any
  let toastStub: any
  beforeEach(
    async(() => {
      nextPage = undefined

      const currentUserServiceStub = {
        isAuthenticated: (): Observable<boolean> =>
          Observable.of(isAuthenticated)
      }

      const navControllerStub = {
        setRoot: (newRoot: string) => (nextPage = newRoot)
      }
      authServiceStub = {
        createOrganization: (organization: Auth.API.ISignupOrganization) =>
          Observable.of({
            name: 'Boon',
            user: sampleUser
          })
      }

      viewControllerStub = {
        dismiss: () => {
          return
        }
      }
      toastStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(viewControllerStub, 'dismiss').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()

      spyOn(authServiceStub, 'createOrganization').and.callThrough()

      fixture = initComponent(SignupPage, {
        imports: [SignupPageModule],
        providers: [
          NavService,
          { provide: ViewController, useValue: viewControllerStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: AuthService, useValue: authServiceStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavController, useValue: navControllerStub }
        ]
      })

      page = new SignupPageObject(fixture)
    })
  )

  describe('when a new business signs up', () => {
    it('includes a signup form', () => {
      isAuthenticated = false

      page.setOrganization('Boon')
      page.setName('John Boon')
      page.setEmail('john@boon.com')
      page.setPhone('9999999999')
      page.setPassword('secret')
      page.setConfirm('secret')
      page.clickSignupButton()
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'You have successfully signed up!'
      })
      expect(authServiceStub.createOrganization).toHaveBeenCalled()
    })

    it('blocks signup if form is invalid', () => {
      page.setEmail('a')
      fixture.detectChanges()
      expect(page.isSignupButtonEnabled).toBe(false)
      page.setPassword('secret')
      page.setConfirm('notsecret')
      fixture.detectChanges()
      expect(page.isSignupButtonEnabled).toBe(false)
      page.setPhone('a')
      fixture.detectChanges()
      expect(page.isSignupButtonEnabled).toBe(false)
    })
  })
})
