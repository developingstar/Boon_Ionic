import { HttpClient, HttpHandler } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { EmailTemplate } from '../../../src/app/messages/email-template.model'
import { EmailTemplatesPage } from '../../../src/app/messages/email-templates.page'
import { EmailTemplatesPageModule } from '../../../src/app/messages/email-templates.page.module'
import { MessagesService } from '../../../src/app/messages/messages.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleEmailTemplate } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { EmailTemplatesPageObject } from './email-templates.page.po'

describe('EmailTemplatesPage', () => {
  let collection: ReadonlyArray<EmailTemplate>
  let fixture: ComponentFixture<EmailTemplatesPage>
  let page: EmailTemplatesPageObject
  let navControllerStub: NavControllerStub
  let messagesServiceStub: MessagesService

  beforeEach(
    async(() => {
      collection = [
        new EmailTemplate(
          sampleEmailTemplate({
            default_sender: 'john@example.com',
            default_sender_name: 'John Boon',
            id: 1,
            name: 'Introduction',
            subject: 'Welcome in Boon'
          })
        ),
        new EmailTemplate(
          sampleEmailTemplate({
            default_sender: 'susan@example.com',
            default_sender_name: null,
            id: 2,
            name: 'Follow up',
            subject: 'Hello from Boon'
          })
        )
      ]

      const httpClient = new HttpClient(
        new class extends HttpHandler {
          handle(req: any): Observable<any> {
            return Observable.never()
          }
        }()
      )

      messagesServiceStub = new MessagesService(httpClient)
      messagesServiceStub.emailTemplates = () => Observable.of(collection)

      spyOn(messagesServiceStub, 'emailTemplates').and.callThrough()

      navControllerStub = new NavControllerStub({ name: 'EmailTemplatesPage' })
      spyOn(navControllerStub, 'setRoot').and.callThrough()

      const currentUserServiceStub = new CurrentUserServiceStub()
      fixture = initComponent(EmailTemplatesPage, {
        imports: [EmailTemplatesPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          {
            provide: MessagesService,
            useValue: messagesServiceStub
          }
        ]
      })

      page = new EmailTemplatesPageObject(fixture)

      fixture.detectChanges()
    })
  )

  describe('table', () => {
    it('includes templates', () => {
      const table = page.getTemplatesTable()

      expect(table.children.length).toBe(3)
      assertTableRow(table.children.item(0), [
        'Name',
        'Subject',
        'Default sender'
      ])
      assertTableRow(table.children.item(1), [
        'Introduction',
        'Welcome in Boon',
        'John Boon <john@example.com>'
      ])
      assertTableRow(table.children.item(2), [
        'Follow up',
        'Hello from Boon',
        'susan@example.com'
      ])
    })

    it('allows clicking on a row', () => {
      page.showTemplate(2)

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'EmailTemplatePage',
        {
          id: collection[0].id
        }
      )
    })
  })

  describe('templates title', () => {
    it('show email templates title', () => {
      expect(page.header).toEqual('Email Templates')
    })
  })

  describe('new template button', () => {
    it('allows creating a new template', () => {
      page.newTemplate()

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'EmailTemplatePage',
        {
          id: 'new'
        }
      )
    })
  })
})
