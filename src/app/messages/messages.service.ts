import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { EmailTemplate } from './email-template.model'
import * as API from './messages.api.model'
import { Shortcode } from './shortcode.model'
import { TextTemplate } from './text-template.model'

@Injectable()
export class MessagesService {
  constructor(private readonly http: HttpClient) {}

  public emailTemplate(id: number): Observable<EmailTemplate | undefined> {
    return this.http
      .get(`/api/templates/${id}`)
      .map(
        (response: API.IEmailTemplateResponse) =>
          new EmailTemplate(response.data.template)
      )
  }

  public emailTemplates(): Observable<ReadonlyArray<EmailTemplate>> {
    return this.http
      .get('/api/templates', { params: { type: 'email' } })
      .map((response: API.IEmailTemplatesResponse) =>
        response.data.templates.map((template) => new EmailTemplate(template))
      )
  }

  public createEmailTemplate(
    requestData: API.IEmailTemplateCreateRequest
  ): Observable<EmailTemplate> {
    return this.http
      .post<API.IEmailTemplateResponse>('/api/templates', {
        template: {
          ...requestData.template,
          type: 'email'
        }
      })
      .map((response) => new EmailTemplate(response.data.template))
  }

  public updateEmailTemplate(
    id: number,
    requestData: API.IEmailTemplateUpdateRequest
  ): Observable<EmailTemplate> {
    return this.http
      .patch<API.IEmailTemplateResponse>(`/api/templates/${id}`, requestData)
      .map((response) => new EmailTemplate(response.data.template))
  }

  public textTemplate(id: number): Observable<TextTemplate | undefined> {
    return this.http
      .get(`/api/templates/${id}`)
      .map(
        (response: API.ITextTemplateResponse) =>
          new TextTemplate(response.data.template)
      )
  }

  public textTemplates(): Observable<ReadonlyArray<TextTemplate>> {
    return this.http
      .get('/api/templates', { params: { type: 'text' } })
      .map((response: API.ITextTemplatesResponse) =>
        response.data.templates.map((template) => new TextTemplate(template))
      )
  }

  public createTextTemplate(
    requestData: API.ITextTemplateCreateRequest
  ): Observable<TextTemplate> {
    return this.http
      .post<API.ITextTemplateResponse>('/api/templates', {
        template: {
          ...requestData.template,
          type: 'text'
        }
      })
      .map((response) => new TextTemplate(response.data.template))
  }

  public updateTextTemplate(
    id: number,
    requestData: API.ITextTemplateUpdateRequest
  ): Observable<TextTemplate> {
    return this.http
      .patch<API.ITextTemplateResponse>(`/api/templates/${id}`, requestData)
      .map((response) => new TextTemplate(response.data.template))
  }

  public shortcodes(): Observable<ReadonlyArray<Shortcode>> {
    return this.http
      .get('/api/shortcodes')
      .map((response: API.IShortcodesResponse) =>
        response.data.shortcodes.map((shortcode) => new Shortcode(shortcode))
      )
  }
}
