import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { Contact } from '../crm/contact.model'
@Injectable()
export class ContactFilterService {
  labelAttribute = 'name'

  constructor(private readonly http: HttpClient) {}

  public getResults(query: string): Observable<Crm.API.ISearchDropdownItem[]> {
    return this.http
      .get('/api/contacts?query=' + query)
      .map((response: Crm.API.IContactsResponse) => {
        if (response.data) {
          const results = response.data.contacts.map(
            (contact: Crm.API.IContact, index: number) => {
              const contactModel = new Contact(contact)
              const name = contactModel.searchDisplayName()
              if (index === 0) {
                return {
                  group_name: 'Contacts',
                  id: contactModel.id,
                  name: name
                }
              } else {
                return {
                  id: contactModel.id,
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
