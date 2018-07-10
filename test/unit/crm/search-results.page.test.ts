import { HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { PaginatedCollection } from '../../../src/app/api/paginated-collection'
import { PaginatedList } from '../../../src/app/api/paginated-list'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Contact } from '../../../src/app/crm/contact.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { SearchResultsPage } from '../../../src/app/crm/search-results.page'
import { SearchResultsPageModule } from '../../../src/app/crm/search-results.page.module'
import { Deal } from '../../../src/app/deals/deal.model'
import { DealsService } from '../../../src/app/deals/deals.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleContact, sampleDeal, sampleUser } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { SearchResultsPageObject } from './search-results.page.po'

describe('SearchResultsPage', () => {
  let dealsServiceStub: any
  let fixture: ComponentFixture<SearchResultsPage>
  let contactsCollection: PaginatedCollection<Contact>
  let dealsCollection: PaginatedList<Deal>
  let page: SearchResultsPageObject
  let salesServiceStub: any
  let navControllerStub: any
  beforeEach(
    async(() => {
      const contact: Crm.API.IContact = sampleContact({
        email: 'leeess@gmail.com',
        name: 'Lisa Newman',
        phone_number: '234332111'
      })

      const user: User = new User(
        sampleUser({
          name: 'Tom'
        })
      )
      contactsCollection = {
        count: 1,
        items: [
          new Contact(
            sampleContact({
              email: 'john@example.com',
              first_name: 'John',
              last_name: 'Boon',
              name: 'John Boon',
              phone_number: '+999111111',
              stage_id: 2
            })
          ),
          new Contact(
            sampleContact({
              email: 'susan@example.com',
              first_name: 'Susan',
              last_name: 'Boon',
              name: 'Susan Boon',
              phone_number: '+999222222',
              stage_id: 2
            })
          ),
          new Contact(
            sampleContact({
              email: null,
              first_name: null,
              last_name: null,
              name: null,
              phone_number: '+999333333',
              stage_id: 1
            })
          )
        ],
        nextPageLink: 'http://example.com/next?query=mar',
        prevPageLink: 'http://example.com/prev?query=mar'
      }
      dealsCollection = {
        items: [
          new Deal(
            sampleDeal({
              name: 'Sample Deal',
              owner: null,
              pipline: 'New',
              stage_id: 1,
              value: 10000
            })
          ),
          new Deal(
            sampleDeal({
              contact: contact,
              name: 'Another Deal',
              owner: null,
              pipline: 'New',
              stage_id: 2,
              value: 10000
            })
          ),
          new Deal(
            sampleDeal({
              name: null,
              owner: null,
              pipline: null,
              stage_id: 1,
              value: null
            })
          )
        ],
        nextPageLink: 'http://example.com/next?query=mar',
        prevPageLink: 'http://example.com/prev?query=mar'
      }
      salesServiceStub = {
        contacts: () => Observable.of(contactsCollection),
        limit: 50
      }
      dealsServiceStub = {
        deals: () => Observable.of(dealsCollection)
      }
      spyOn(salesServiceStub, 'contacts').and.callThrough()
      spyOn(dealsServiceStub, 'deals').and.callThrough()

      navControllerStub = new NavControllerStub()
      spyOn(navControllerStub, 'push').and.callThrough()

      const currentUserServiceStub = new CurrentUserServiceStub(user)
      const navParamsStub = {
        get: (prop: string) => 'mar'
      }
      navControllerStub = new NavControllerStub()
      spyOn(navControllerStub, 'push').and.callThrough()
      fixture = initComponent(SearchResultsPage, {
        imports: [SearchResultsPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: DealsService, useValue: dealsServiceStub }
        ]
      })
      page = new SearchResultsPageObject(fixture)
      fixture.detectChanges()
    })
  )

  describe('page UI', () => {
    it('show buttons', () => {
      expect(page.isButtonVisible('Contacts')).toBe(true)
      expect(page.isButtonVisible('Deals')).toBe(true)
      expect(page.isButtonVisible('Referrers')).toBe(true)
      expect(page.hasClass('Contacts', '.nav-item-active')).toBe(true)
      expect(page.hasClass('Deals', '.nav-item-active')).toBe(false)
      expect(page.hasClass('Referrers', '.nav-item-active')).toBe(false)
    })
  })

  describe('contact filter', () => {
    it('table shows contacts', () => {
      const table = page.resultsTable()
      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Phone number',
        'Created at',
        ''
      ])
      assertTableRow(table.children.item(1), [
        'John Boon',
        'john@example.com',
        '+999111111',
        '01 Dec 2017 12:00 AM',
        ''
      ])
      assertTableRow(table.children.item(2), [
        'Susan Boon',
        'susan@example.com',
        '+999222222',
        '01 Dec 2017 12:00 AM',
        ''
      ])
      assertTableRow(table.children.item(3), [
        '-',
        '-',
        '+999333333',
        '01 Dec 2017 12:00 AM',
        ''
      ])
    })
    it('allows to load contacts from different pages', () => {
      expect(salesServiceStub.contacts).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })
      page.clickNextPageButton()
      expect(salesServiceStub.contacts).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/next?query=mar'
      })
      page.clickPrevPageButton()
      expect(salesServiceStub.contacts).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/prev?query=mar'
      })
    })
  })
  describe('contact deals', () => {
    beforeEach(
      async(() => {
        page.clickActionButton('Deals')
        fixture.detectChanges()
      })
    )

    it('show buttons', () => {
      expect(page.hasClass('Contacts', '.nav-item-active')).toBe(false)
      expect(page.hasClass('Deals', '.nav-item-active')).toBe(true)
      expect(page.hasClass('Referrers', '.nav-item-active')).toBe(false)
    })

    it('table shows deals', () => {
      const table = page.resultsTable()
      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Phone number',
        'Created at',
        ''
      ])
      assertTableRow(table.children.item(1), ['Sample Deal', '-', '-', '', ''])
      assertTableRow(table.children.item(2), [
        'Another Deal',
        'leeess@gmail.com',
        '234332111',
        '01 Dec 2017 12:00 AM',
        ''
      ])
      assertTableRow(table.children.item(3), ['-', '-', '-', '', ''])
    })
    it('allows to load contacts from different pages', () => {
      page.clickNextPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: '/api/deals?per_page=50&query=mar'
      })
      page.clickPrevPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: '/api/deals?per_page=50&query=mar'
      })
    })
  })
  it('opens the clicked items page after clicking an entry in the table', () => {
    page.click(page.findDebugByCss('ion-row.result'))
    expect(navControllerStub.push).toHaveBeenCalled()
  })
})
