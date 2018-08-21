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
      .map((response: Deal.API.IDealResponse) => {
        const page: PaginatedList<Deal> = {
          items: response.data.deals.map((raw) => new Deal(raw)),
          nextPageLink: response.links.next,
          prevPageLink: response.links.prev
        }
        return page
      })
  }
}
