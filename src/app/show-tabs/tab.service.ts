import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Lead } from '../crm/lead.model'
import { Deal } from '../deals/deal.model'

/**
 * To be used to communicate data between the tabs and the parent pages (contact and deals show)
 */
@Injectable()
export class TabService {
  private contactSubject = new Subject<Lead>()
  private dealSubject = new Subject<Deal>()

  getContact(): Subject<Lead> {
    return this.contactSubject
  }

  setContact(contact: Lead): void {
    this.contactSubject.next(contact)
  }

  getDeal(): Subject<Deal> {
    return this.dealSubject
  }

  setDeal(deal: Deal): void {
    this.dealSubject.next(deal)
  }
}
