import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { Lead } from '../crm/lead.model'
@Injectable()
export class LeadFilterService {
  labelAttribute = 'name'

  constructor(private readonly http: HttpClient) {}

  public getResults(query: string): Observable<Crm.API.ISearchDropdownItem[]> {
    return this.http
      .get('/api/leads?query=' + query)
      .map((response: Crm.API.ILeadsResponse) => {
        if (response.data) {
          const results = response.data.leads.map(
            (lead: Crm.API.ILead, index: number) => {
              const leadModel = new Lead(lead)
              const name = leadModel.searchDisplayName()
              if (index === 0) {
                return {
                  comment: '$13, 000',
                  group_name: 'Group1',
                  id: leadModel.id,
                  name: name
                }
              } else {
                return {
                  comment: '$11, 000',
                  id: leadModel.id,
                  name: name
                }
              }
            }
          )
          return results
        } else {
          Observable.throw({ message: 'Internal Server Error' })
          return []
        }
      })
  }

  public getTestResults(
    query: string = 'vin'
  ): Observable<Crm.API.ISearchDropdownItem[]> {
    // Fake API for testing
    return this.http
      .get('/api/leads?query=' + query)
      .map((response: Crm.API.ILeadsResponse) => {
        if (response.data) {
          const results = response.data.leads.map(
            (lead: Crm.API.ILead, index: number) => {
              const leadModel = new Lead(lead)
              const name = leadModel.searchDisplayName()
              if (index === 0) {
                return {
                  comment: 'main@email.com',
                  group_name: 'Group2',
                  id: leadModel.id,
                  name: name
                }
              } else {
                return {
                  comment: 'example' + leadModel.id + '@email.com',
                  id: leadModel.id,
                  name: name
                }
              }
            }
          )
          return results
        } else {
          Observable.throw({ message: 'Internal Server Error' })
          return []
        }
      })
  }
}
