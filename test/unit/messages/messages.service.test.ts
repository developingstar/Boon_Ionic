import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { EmailTemplate } from '../../../src/app/messages/email-template.model'
import { MessagesService } from '../../../src/app/messages/messages.service'
import { TextTemplate } from '../../../src/app/messages/text-template.model'

describe('MessagesService', () => {
  let httpMock: HttpTestingController
  let service: MessagesService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [MessagesService]
      })

      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(MessagesService)
    })
  )

  describe('emailTemplate', () => {
    it(
      'returns template',
      async(() => {
        service.emailTemplate(1).subscribe((template: EmailTemplate) => {
          expect(template).toEqual(
            new EmailTemplate({
              content: 'Welcome in Boon',
              default_sender: 'support@example.com',
              default_sender_name: 'Support',
              id: 1,
              name: 'Introduction',
              subject: 'Introduction'
            })
          )
        })

        const req = httpMock.expectOne('/api/templates/1')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            template: {
              content: 'Welcome in Boon',
              default_sender: 'support@example.com',
              default_sender_name: 'Support',
              id: 1,
              name: 'Introduction',
              subject: 'Introduction',
              type: 'email'
            }
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('emailTemplates', () => {
    it(
      'returns all templates',
      async(() => {
        service.emailTemplates().subscribe((templates) => {
          expect(templates.length).toEqual(2)
          expect(templates[0]).toEqual(
            new EmailTemplate({
              content: 'Welcome in Boon',
              default_sender: 'support@example.com',
              default_sender_name: 'Support',
              id: 1,
              name: 'Introduction',
              subject: 'Introduction'
            })
          )
          expect(templates[1]).toEqual(
            new EmailTemplate({
              content: 'Susan will be your sales contact',
              default_sender: 'user@example.com',
              default_sender_name: null,
              id: 2,
              name: 'Lead owner assigned',
              subject: 'Your sales contact'
            })
          )
        })

        const req = httpMock.expectOne('/api/templates?type=email')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            templates: [
              {
                content: 'Welcome in Boon',
                default_sender: 'support@example.com',
                default_sender_name: 'Support',
                id: 1,
                name: 'Introduction',
                subject: 'Introduction',
                type: 'email'
              },
              {
                content: 'Susan will be your sales contact',
                default_sender: 'user@example.com',
                default_sender_name: null,
                id: 2,
                name: 'Lead owner assigned',
                subject: 'Your sales contact',
                type: 'email'
              }
            ]
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('textTemplate', () => {
    it(
      'returns a template',
      async(() => {
        service.textTemplate(2).subscribe((template: TextTemplate) => {
          expect(template).toEqual(
            new TextTemplate({
              content: 'Welcome in Boon',
              default_sender: '+999700100106',
              id: 1,
              name: 'Introduction'
            })
          )
        })

        const req = httpMock.expectOne('/api/templates/2')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            template: {
              content: 'Welcome in Boon',
              default_sender: '+999700100106',
              default_sender_name: null,
              id: 1,
              name: 'Introduction',
              subject: null,
              type: 'text'
            }
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('textTemplates', () => {
    it(
      'returns all templates',
      async(() => {
        service.textTemplates().subscribe((templates) => {
          expect(templates.length).toEqual(2)
          expect(templates[0]).toEqual(
            new TextTemplate({
              content: 'Welcome in Boon',
              default_sender: '+999700100106',
              id: 1,
              name: 'Introduction'
            })
          )
          expect(templates[1]).toEqual(
            new TextTemplate({
              content: 'Susan will be your sales contact',
              default_sender: '+999700100100',
              id: 2,
              name: 'Lead owner assigned'
            })
          )
        })

        const req = httpMock.expectOne('/api/templates?type=text')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            templates: [
              {
                content: 'Welcome in Boon',
                default_sender: '+999700100106',
                default_sender_name: null,
                id: 1,
                name: 'Introduction',
                subject: null,
                type: 'text'
              },
              {
                content: 'Susan will be your sales contact',
                default_sender: '+999700100100',
                default_sender_name: null,
                id: 2,
                name: 'Lead owner assigned',
                subject: null,
                type: 'text'
              }
            ]
          }
        })

        httpMock.verify()
      })
    )
  })
})
