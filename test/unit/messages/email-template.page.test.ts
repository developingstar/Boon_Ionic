import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler
} from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { EmailTemplate } from '../../../src/app/messages/email-template.model'
import { EmailTemplatePage } from '../../../src/app/messages/email-template.page'
import { EmailTemplatePageModule } from '../../../src/app/messages/email-template.page.module'
import { MessagesService } from '../../../src/app/messages/messages.service'
import { NavService } from '../../../src/app/nav/nav.service'
import {
  toastSuccessDefaults,
  toastWarningDefaults
} from '../../../src/app/utils/toast'
import { sampleEmailTemplate, sampleShortcode } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { EmailTemplatePageObject } from './email-template.page.po'

describe('EmailTemplatePage', () => {
  let fixture: ComponentFixture<EmailTemplatePage>
  let messagesServiceStub: MessagesService
  let navControllerStub: NavControllerStub
  let navParamsStub: any
  let page: EmailTemplatePageObject
  let template: EmailTemplate
  let toastControllerStub: any
  let toastStub: any
  const currentUserServiceStub = new CurrentUserServiceStub()

  beforeEach(
    async(() => {
      template = new EmailTemplate(
        sampleEmailTemplate({
          content: 'Hello',
          default_sender: 'user@example.com',
          default_sender_name: 'Support',
          id: 1,
          name: 'Introduction e-mail message',
          subject: 'Introduction'
        })
      )

      const httpClient = new HttpClient(
        new class extends HttpHandler {
          handle(req: any): Observable<any> {
            return Observable.never()
          }
        }()
      )

      messagesServiceStub = new MessagesService(httpClient)
      messagesServiceStub.shortcodes = () =>
        Observable.of([
          sampleShortcode({ name: 'First Name', shortcode: 'first_name' }),
          sampleShortcode({ name: 'Last Name', shortcode: 'last_name' })
        ])

      navControllerStub = new NavControllerStub({ name: 'EmailTemplatePage' })
      spyOn(navControllerStub, 'setRoot').and.callThrough()

      toastStub = {
        present: () => {
          return
        }
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(toastStub, 'present').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()
    })
  )

  describe('create', () => {
    beforeEach(
      async(() => {
        messagesServiceStub.createEmailTemplate = () => {
          return Observable.of(template)
        }

        navParamsStub = {
          get: (prop: string) => 'new'
        }

        fixture = initComponent(EmailTemplatePage, {
          imports: [EmailTemplatePageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: navControllerStub },
            { provide: CurrentUserService, useValue: currentUserServiceStub },
            { provide: NavParams, useValue: navParamsStub },
            {
              provide: MessagesService,
              useValue: messagesServiceStub
            },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new EmailTemplatePageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('allows to create template', () => {
      spyOn(messagesServiceStub, 'createEmailTemplate').and.callThrough()

      page.setName('Introduction to Boon')
      page.setSubject('Welcome in Boon')
      page.setFromName('Sales Team')
      page.setFromEmail('sales@example.com')
      page.setContent('Hello from Boon team!')
      page.save()

      expect(messagesServiceStub.createEmailTemplate).toHaveBeenCalledWith({
        template: {
          content: 'Hello from Boon team!',
          default_sender: 'sales@example.com',
          default_sender_name: 'Sales Team',
          name: 'Introduction to Boon',
          shortcode: null,
          subject: 'Welcome in Boon'
        }
      })
      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'EmailTemplatesPage'
      )
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Template has been successfully saved.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('handles an error', () => {
      spyOn(messagesServiceStub, 'createEmailTemplate').and.callFake(() => {
        return Observable.throw(new HttpErrorResponse({ status: 422 }))
      })

      page.setName('Introduction to Boon')
      page.save()

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastWarningDefaults,
        duration: 2000,
        message:
          'Failed to save the template. Make sure that the name is unique.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    beforeEach(
      async(() => {
        messagesServiceStub.emailTemplate = () => Observable.of(template)
        messagesServiceStub.updateEmailTemplate = () => Observable.of(template)
        spyOn(messagesServiceStub, 'emailTemplate').and.callThrough()

        navParamsStub = {
          get: (prop: string) => template.id
        }

        fixture = initComponent(EmailTemplatePage, {
          imports: [EmailTemplatePageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: navControllerStub },
            { provide: CurrentUserService, useValue: currentUserServiceStub },
            { provide: NavParams, useValue: navParamsStub },
            {
              provide: MessagesService,
              useValue: messagesServiceStub
            },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new EmailTemplatePageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('fills initial values', () => {
      spyOn(messagesServiceStub, 'updateEmailTemplate').and.callThrough()

      expect(page.getName()).toEqual(template.name)
      expect(page.getSubject()).toEqual(template.subject)
      expect(page.getFromName()).toEqual(template.defaultSenderName!)
      expect(page.getFromEmail()).toEqual(template.defaultSender)
      expect(page.getContent()).toEqual(template.content)
    })

    it('allows to update template', () => {
      spyOn(messagesServiceStub, 'updateEmailTemplate').and.callThrough()

      page.setName('Introduction to Boon')
      page.setSubject('Welcome in Boon')
      page.setFromName('Sales Team')
      page.setFromEmail('sales@example.com')
      page.setContent('Hello from Boon team!')
      page.save()

      expect(messagesServiceStub.updateEmailTemplate).toHaveBeenCalledWith(1, {
        template: {
          content: 'Hello from Boon team!',
          default_sender: 'sales@example.com',
          default_sender_name: 'Sales Team',
          name: 'Introduction to Boon',
          shortcode: null,
          subject: 'Welcome in Boon'
        }
      })

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'EmailTemplatesPage'
      )

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Template has been successfully saved.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('handles an error', () => {
      spyOn(messagesServiceStub, 'updateEmailTemplate').and.callFake(() => {
        return Observable.throw(new HttpErrorResponse({ status: 422 }))
      })

      page.setName('Introduction to Boon')
      page.save()

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastWarningDefaults,
        duration: 2000,
        message:
          'Failed to save the template. Make sure that the name is unique.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })
  })
})
