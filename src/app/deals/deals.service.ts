import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { PaginatedList } from '../api/paginated-list'
import { Deal } from './deal.model'

@Injectable()
export class DealsService {
  constructor(private http: HttpClient) {}

  public deals(url?: string): Observable<PaginatedList<Deal>> {
    return this.http
      .get(url || '/api/deals?per_page=50')
      .map((response: Deal.API.IDealsResponse) => {
        const page: PaginatedList<Deal> = {
          items: response.data.deals.map((raw) => new Deal(raw)),
          nextPageLink: response.links.next,
          prevPageLink: response.links.prev
        }
        return page
      })
  }

  public getDeal(dealId: string): Observable<Deal> {
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
