import { HttpClient, HttpHandler } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { MessagesService } from '../../../src/app/messages/messages.service'
import { TextTemplate } from '../../../src/app/messages/text-template.model'
import { TextTemplatesPage } from '../../../src/app/messages/text-templates.page'
import { TextTemplatesPageModule } from '../../../src/app/messages/text-templates.page.module'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleTextTemplate } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { TextTemplatesPageObject } from './text-templates.page.po'

describe('TextTemplatesPage', () => {
  let collection: ReadonlyArray<TextTemplate>
  let fixture: ComponentFixture<TextTemplatesPage>
  let messagesServiceStub: MessagesService
  let navControllerStub: NavControllerStub
  let page: TextTemplatesPageObject

  beforeEach(
    async(() => {
      collection = [
        new TextTemplate(
          sampleTextTemplate({
            default_sender: '+999111111',
            id: 1,
            name: 'Introduction'
          })
        ),
        new TextTemplate(
          sampleTextTemplate({
            default_sender: '+999222222',
            id: 2,
            name: 'Follow up'
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
      messagesServiceStub.textTemplates = () => Observable.of(collection)

      spyOn(messagesServiceStub, 'textTemplates').and.callThrough()

      navControllerStub = new NavControllerStub({ name: 'TextTemplatesPage' })
      spyOn(navControllerStub, 'setRoot').and.callThrough()

      const currentUserServiceStub = new CurrentUserServiceStub()

      fixture = initComponent(TextTemplatesPage, {
        imports: [TextTemplatesPageModule, HttpClientTestingModule],
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

      page = new TextTemplatesPageObject(fixture)

      fixture.detectChanges()
    })
  )

  describe('table', () => {
    it('includes templates', () => {
      const table = page.getTemplatesTable()

      expect(table.children.length).toBe(3)
      assertTableRow(table.children.item(0), ['Name', 'Default sender'])
      assertTableRow(table.children.item(1), ['Introduction', '+999111111'])
      assertTableRow(table.children.item(2), ['Follow up', '+999222222'])
    })

    it('allows clicking on a row', () => {
      page.showTemplate(2)

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'TextTemplatePage',
        {
          id: collection[0].id
        }
      )
    })
  })

  describe('templates title', () => {
    it('show text message templates title', () => {
      expect(page.header).toEqual('Text Message Templates')
    })
  })

  describe('new template button', () => {
    it('allows creating a new template', () => {
      page.newTemplate()

      expect(navControllerStub.setRoot).toHaveBeenCalledWith(
        'TextTemplatePage',
        {
          id: 'new'
        }
      )
    })
  })
})
