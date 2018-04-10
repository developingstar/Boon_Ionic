import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
import { Template } from './template.model'
import * as API from './templates.api.model'

@Injectable()
export class TemplatesService {
  constructor(private readonly http: HttpClient) {}

  public templates(): Observable<ReadonlyArray<Template>> {
    return this.http
      .get('/api/templates')
      .map((response: API.ITemplatesResponse) => (response.data.templates.map((raw) => new Template(raw))
      ))
  }

  template(id: number): Observable<Template> {
    return this.http
      .get(`/api/templates/${id}`)
      .map((response: API.ITemplateResponse) => new Template(response.data.template))
  }
}
