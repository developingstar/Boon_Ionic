import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { EmailTemplate } from './email-template.model'
import * as API from './messages.api.model'
import { TextTemplate } from './text-template.model'

@Injectable()
export class MessagesService {
  constructor(private readonly http: HttpClient) {}

  public emailTemplate(id: number): Observable<EmailTemplate | undefined> {
    return this.http.get(`/api/templates/${id}`).map(
      (response: {
        readonly data: {
          readonly template: API.IEmailTemplate
        }
      }) => new EmailTemplate(response.data.template)
    )
  }

  public emailTemplates(): Observable<ReadonlyArray<EmailTemplate>> {
    return this.http
      .get('/api/templates', { params: { type: 'email' } })
      .map(
        (response: {
          readonly data: {
            readonly templates: ReadonlyArray<API.IEmailTemplate>
          }
        }) =>
          response.data.templates.map((template) => new EmailTemplate(template))
      )
  }

  public textTemplate(id: number): Observable<TextTemplate | undefined> {
    return this.http.get(`/api/templates/${id}`).map(
      (response: {
        readonly data: {
          readonly template: API.ITextTemplate
        }
      }) => new TextTemplate(response.data.template)
    )
  }

  public textTemplates(): Observable<ReadonlyArray<TextTemplate>> {
    return this.http
      .get('/api/templates', { params: { type: 'text' } })
      .map(
        (response: {
          readonly data: {
            readonly templates: ReadonlyArray<API.ITextTemplate>
          }
        }) =>
          response.data.templates.map((template) => new TextTemplate(template))
      )
  }
}
