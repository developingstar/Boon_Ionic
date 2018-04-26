import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler
} from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { MessagesService } from '../../../src/app/messages/messages.service'
import { PhoneNumbersService } from '../../../src/app/messages/phone-numbers.service'
import { TextTemplate } from '../../../src/app/messages/text-template.model'
import { TextTemplatePage } from '../../../src/app/messages/text-template.page'
import { TextTemplatePageModule } from '../../../src/app/messages/text-template.page.module'
import { NavService } from '../../../src/app/nav/nav.service'
import {
  toastSuccessDefaults,
  toastWarningDefaults
} from '../../../src/app/utils/toast'
import { sampleShortcode, sampleTextTemplate } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { TextTemplatePageObject } from './text-template.page.po'

describe('TextTemplatePage', () => {
  let fixture: ComponentFixture<TextTemplatePage>
  let messagesServiceStub: MessagesService
  let navControllerStub: NavControllerStub
  let navParamsStub: any
  let page: TextTemplatePageObject
  let phoneNumbers: ReadonlyArray<string>
  let phoneNumbersService: PhoneNumbersService
  let template: TextTemplate
  let toastControllerStub: any
  let toastStub: any

  beforeEach(
    async(() => {
      template = sampleTextTemplate({
        content: 'Welcome in Boon',
        default_sender: '+999111111',
        id: 1,
        name: 'Introduction'
      })

      phoneNumbers = ['+999000000', '+999111111', '+999222222']

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

      phoneNumbersService = new PhoneNumbersService(httpClient)
      phoneNumbersService.getAll = () => Observable.of(phoneNumbers)
      spyOn(phoneNumbersService, 'getAll').and.callThrough()

      navControllerStub = new NavControllerStub({ name: 'TextTemplatePage' })
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
        messagesServiceStub.createTextTemplate = () => Observable.of(template)

        navParamsStub = {
          get: (prop: string) => 'new'
        }

        fixture = initComponent(TextTemplatePage, {
          imports: [TextTemplatePageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: navControllerStub },
            { provide: NavParams, useValue: navParamsStub },
            {
              provide: MessagesService,
              useValue: messagesServiceStub
            },
            { provide: PhoneNumbersService, useValue: phoneNumbersService },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new TextTemplatePageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('allows to create template', () => {
      spyOn(messagesServiceStub, 'createTextTemplate').and.callThrough()

      page.setName('Introduction to Boon')
      page.setContent('Hello from Boon team!')
      page.selectPhoneNumber('+999222222')
      page.save()

      expect(messagesServiceStub.createTextTemplate).toHaveBeenCalledWith({
        template: {
          content: 'Hello from Boon team!',
          default_sender: '+999222222',
          name: 'Introduction to Boon'
        }
      })

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'TextTemplatesPage'
      )

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        message: 'Template has been successfully saved.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('handles an error', () => {
      spyOn(messagesServiceStub, 'createTextTemplate').and.callFake(() => {
        return Observable.throw(new HttpErrorResponse({ status: 422 }))
      })

      page.setName('Introduction to Boon')
      page.save()

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastWarningDefaults,
        message:
          'Failed to save the template. Make sure that the name is unique.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('includes shortcodes list', () => {
      expect(page.getShortcodes()).toEqual([
        '{{ first_name }}',
        '{{ last_name }}'
      ])
    })
  })

  describe('update', () => {
    beforeEach(
      async(() => {
        messagesServiceStub.textTemplate = () => Observable.of(template)
        messagesServiceStub.updateTextTemplate = () => Observable.of(template)
        spyOn(messagesServiceStub, 'textTemplate').and.callThrough()

        navParamsStub = {
          get: (prop: string) => template.id
        }

        fixture = initComponent(TextTemplatePage, {
          imports: [TextTemplatePageModule, HttpClientTestingModule],
          providers: [
            NavService,
            { provide: NavController, useValue: navControllerStub },
            { provide: NavParams, useValue: navParamsStub },
            {
              provide: MessagesService,
              useValue: messagesServiceStub
            },
            { provide: PhoneNumbersService, useValue: phoneNumbersService },
            { provide: ToastController, useValue: toastControllerStub }
          ]
        })

        page = new TextTemplatePageObject(fixture)

        fixture.detectChanges()
      })
    )

    it('fills initial values', () => {
      spyOn(messagesServiceStub, 'updateTextTemplate').and.callThrough()

      expect(page.getName()).toEqual(template.name)
      expect(page.getPhoneNumber()).toEqual(template.default_sender)
      expect(page.getContent()).toEqual(template.content)
    })

    it('allows to update template', () => {
      spyOn(messagesServiceStub, 'updateTextTemplate').and.callThrough()

      page.setName('Introduction to Boon')
      page.setContent('Hello from Boon team!')
      page.selectPhoneNumber('+999222222')
      page.save()

      expect(messagesServiceStub.updateTextTemplate).toHaveBeenCalledWith(1, {
        template: {
          content: 'Hello from Boon team!',
          default_sender: '+999222222',
          name: 'Introduction to Boon'
        }
      })

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'TextTemplatesPage'
      )

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        message: 'Template has been successfully saved.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('handles an error', () => {
      spyOn(messagesServiceStub, 'updateTextTemplate').and.callFake(() => {
        return Observable.throw(new HttpErrorResponse({ status: 422 }))
      })

      page.setName('Introduction to Boon')
      page.save()

      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastWarningDefaults,
        message:
          'Failed to save the template. Make sure that the name is unique.'
      })
      expect(toastStub.present).toHaveBeenCalled()
    })

    it('includes shortcodes list', () => {
      expect(page.getShortcodes()).toEqual([
        '{{ first_name }}',
        '{{ last_name }}'
      ])
    })
  })
})
