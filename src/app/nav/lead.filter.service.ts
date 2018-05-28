import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AutoCompleteService } from 'ionic2-auto-complete'
import { Observable } from 'rxjs'

import { Lead } from '../crm/lead.model'
@Injectable()
export class LeadFilterService implements AutoCompleteService {
  labelAttribute = 'name'

  constructor(private readonly http: HttpClient) {}

  public getResults(query: string): Observable<any[]> {
    return this.http
      .get('/api/leads?query=' + query)
      .map((response: Crm.API.ILeadsResponse) => {
        if (response.data) {
          const results = response.data.leads.map((lead: Crm.API.ILead) => {
            const leadModel = new Lead(lead)
            let name = leadModel.name ? leadModel.name : leadModel.email
            name = name ? name : leadModel.phoneNumber
            return {
              id: leadModel.id,
              name: name
            }
          })
          return results
        } else {
          Observable.throw({ message: 'Internal Server Error' })
          return []
        }
      })
  }
}
