import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import * as API from './integration.api.model'
import { Service } from './service.model'

@Injectable()
export class IntegrationsService {
  constructor(private readonly http: HttpClient) {}

  public services(): Observable<ReadonlyArray<Service>> {
    return this.http
      .get('/api/services')
      .map((response: API.IServicesResponse) =>
        response.data.services.map((item) => new Service(item))
      )
  }

  service(id: number): Observable<Service> {
    return this.http
      .get<API.IServiceResponse>(`/api/services/${id}`)
      .map(
        (response: API.IServiceResponse) => new Service(response.data.service)
      )
  }

  createService(service?: Service): Observable<Service> {
    return this.http
      .post<API.IServiceResponse>(
        `/api/services`,
        JSON.stringify({ service: service })
      )
      .map(
        (response: API.IServiceResponse) => new Service(response.data.service)
      )
  }

  updateService(id: number, service?: Service): Observable<Service> {
    return this.http
      .patch<API.IServiceResponse>(
        `/api/services/${id}`,
        JSON.stringify({ service: service })
      )
      .map(
        (response: API.IServiceResponse) => new Service(response.data.service)
      )
  }
}
