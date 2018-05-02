import { HttpClient } from '@angular/common/http'
import {Injectable} from '@angular/core'
import {AutoCompleteService} from 'ionic2-auto-complete'
import { Observable } from 'rxjs'

@Injectable()
export class LeadFilterService implements AutoCompleteService {
  labelAttribute = 'name'

  constructor(private readonly http: HttpClient) {

  }

  public getResults(keyword: string): Observable<any[]> {
    return this.http.get('/api/leads') // TODO: Update API Endpoint
      .map((response: Crm.API.ILeadsResponse) => {
        const json = response.data
        if (json) {
          const results = response.data.leads.map((lead) => {
            const filteredLead = { id: lead.id, name: '' }
            filteredLead.name = lead.owner && lead.owner.name ? lead.owner.name : ''
            return filteredLead
          })
          return results.filter((lead) => lead.name !== '') // TODO: Update if API endpoint is correct
        } else {
          Observable.throw({ message: 'Internal Server Error' })
          return []
        }
      })
  }
}
