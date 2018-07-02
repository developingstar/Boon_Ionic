import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedList } from '../api/paginated-list'
import { Pipeline } from '../crm/pipeline.model'
import { Deal } from './deal.model'

@Injectable()
export class DealsService {
  constructor(private http: HttpClient) {}

  public deals(
    options: IHttpRequestOptions = blankHttpRequestOptions
  ): Observable<PaginatedList<Deal>> {
    return this.http
      .get(options.url || '/api/deals?per_page=50', { params: options.params })
      .map((response: Deal.API.IDealsResponse) => {
        const page: PaginatedList<Deal> = {
          items: response.data.deals.map((raw) => new Deal(raw)),
          nextPageLink: response.links.next,
          prevPageLink: response.links.prev,
          totalCount: response.metadata.count
        }
        return page
      })
  }

  public pipelines(): Observable<Pipeline[]> {
    return this.http
      .get('/api/pipelines')
      .map((response: Crm.API.IPipelinesResponse) =>
        response.data.pipelines.map((item) => new Pipeline(item))
      )
  }

  public getDeal(dealId: string): Observable<any> {
    return this.http
      .get(`api/deals/${dealId}`)
      .map((response: Deal.API.IDealResponse) => new Deal(response.data.deal))
  }

  public updateDeal(dealId: number | null, dealUpdate: any): Observable<Deal> {
    return this.http
      .patch(`api/deals/${dealId}`, JSON.stringify({ deal: dealUpdate }))
      .map((response: Deal.API.IDealResponse) => new Deal(response.data.deal))
  }
}
