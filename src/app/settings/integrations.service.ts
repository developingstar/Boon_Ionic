import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
import * as API from './integrations.api.model'
import { Service } from './service.model'

@Injectable()
export class IntegrationsService {
  constructor(private readonly http: HttpClient) {}

  public services(): Observable<ReadonlyArray<Service>> {
    return this.http
      .get('/api/services')
      .map((response: API.IServicesResponse) =>
        response.data.services.map((item) => new Service(item.service))
      )
  }

  service(id: number): Observable<Service> {
    return this.http
      .get<API.IServiceResponse>(`/api/services/${id}`)
      .map((response) => new Service(response.data.service))
  }
}
