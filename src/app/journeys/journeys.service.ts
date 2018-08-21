import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
import { PaginatedCollection } from './../api/paginated-collection'
import { Journey } from './journey.model'
import * as API from './journeys.api.model'

@Injectable()
export class JourneysService {
  constructor(private readonly http: HttpClient) {}

  journeys(
    options: IHttpRequestOptions = blankHttpRequestOptions
  ): Observable<PaginatedCollection<Journey>> {
    return this.http
      .get<API.IJourneysResponse>(options.url || '/api/journeys', {
        params: options.params
      })
      .map((response) => ({
        count: 1,
        items: response.data.journeys.map((raw) => new Journey(raw)),
        nextPageLink: response.links.next,
        prevPageLink: response.links.prev
      }))
  }

  journey(id: number): Observable<Journey> {
    return this.http
      .get<API.IJourneyResponse>(`/api/journeys/${id}`)
      .map((response) => new Journey(response.data.journey))
  }

  stopJourney(id: number): Observable<Journey> {
    return this.updateJourney(id, {
      journey: {
        state: 'inactive'
      }
    })
  }

  publishJourney(id: number): Observable<Journey> {
    return this.updateJourney(id, {
      journey: {
        state: 'active'
      }
    })
  }

  updateJourney(
    id: number,
    requestData: API.IJourneyUpdateRequest
  ): Observable<Journey> {
    return this.http
      .patch<API.IJourneyResponse>(`/api/journeys/${id}`, requestData)
      .map((response) => new Journey(response.data.journey))
  }

  createJourney(requestData: API.IJourneyCreateRequest): Observable<Journey> {
    return this.http
      .post<API.IJourneyResponse>('/api/journeys', requestData)
      .map((response) => new Journey(response.data.journey))
  }
}
