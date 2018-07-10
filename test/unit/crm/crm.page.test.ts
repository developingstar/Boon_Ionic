import { HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { ModalController, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { PaginatedCollection } from '../../../src/app/api/paginated-collection'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Contact } from '../../../src/app/crm/contact.model'
import { CrmPage } from '../../../src/app/crm/crm.page'
import { CrmPageModule } from '../../../src/app/crm/crm.page.module'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { NavService } from '../../../src/app/nav/nav.service'
import {
  sampleContact,
  samplePipeline,
  sampleStage,
  sampleUser
} from '../../support/factories'
import { initComponent, setTimeZone } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { CrmPageObject } from './crm.page.po'

describe('CrmPage', () => {
  let collection: PaginatedCollection<Contact>
  let fixture: ComponentFixture<CrmPage>
  let page: CrmPageObject
  let salesServiceStub: any
  let navControllerStub: any
  let modalStub: any
  let modalControllerStub: any
  beforeEach(
    async(() => {
      const user: User = new User(
        sampleUser({
          name: 'Tom'
        })
      )

      collection = {
        count: 3,
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
              owner: user,
              phone_number: '+999333333',
              stage_id: 1
            })
          )
        ],
        nextPageLink: 'http://example.com/next',
        prevPageLink: 'http://example.com/prev'
      }
      salesServiceStub = {
        contacts: () => Observable.of(collection),
        limit: 50,
        pipelines: () =>
          Observable.of([
            new Pipeline(
              samplePipeline({ id: 1, name: 'Converted', stage_order: [2, 1] })
            ),
            new Pipeline(samplePipeline({ id: 2, name: 'Without response' }))
          ]),
        showingHigh: 50,
        showingLow: 1,
        stages: () =>
          Observable.of([
            sampleStage({ id: 1, name: 'Closed - Won', pipeline_id: 1 }),
            sampleStage({ id: 2, name: 'Introduction', pipeline_id: 1 }),
            sampleStage({ id: 3, name: 'Needs follow-up', pipeline_id: 2 })
          ])
      }
      spyOn(salesServiceStub, 'contacts').and.callThrough()
      const currentUserServiceStub = new CurrentUserServiceStub(user)
      navControllerStub = new NavControllerStub()
      spyOn(navControllerStub, 'push').and.callThrough()
      modalStub = {
        present: () => {
          return
        }
      }
      spyOn(modalStub, 'present').and.callThrough()
      modalControllerStub = {
        create: () => modalStub
      }
      spyOn(modalControllerStub, 'create').and.callThrough()
      fixture = initComponent(CrmPage, {
        imports: [CrmPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: ModalController, useValue: modalControllerStub }
        ]
      })
      page = new CrmPageObject(fixture)
      fixture.detectChanges()
    })
  )
  describe('table', () => {
    it('includes contacts', () => {
      setTimeZone()
      const table = page.contactsTable()
      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Phone number',
        'Created at',
        'Contact owner',
        ''
      ])
      assertTableRow(table.children.item(1), [
        'John Boon',
        'john@example.com',
        '+999111111',
        '01 Dec 2017',
        '-',
        ''
      ])
      assertTableRow(table.children.item(2), [
        'Susan Boon',
        'susan@example.com',
        '+999222222',
        '01 Dec 2017',
        '-',
        ''
      ])
      assertTableRow(table.children.item(3), [
        '-',
        '-',
        '+999333333',
        '01 Dec 2017',
        'Tom',
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
        url: 'http://example.com/next'
      })
      page.clickPrevPageButton()
      expect(salesServiceStub.contacts).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/prev'
      })
    })
  })
  describe('showing from(x) to(y) of toatl(z) contacts', () => {
    it('shows correct x(from), y(to) and z(number of total contacts)', () => {
      expect(page.showingTotal().textContent).toEqual('3 Total')
      page.clickNextPageButton()
    })
  })
  it('opens the contact page after clicking an entry in the table', () => {
    page.click(page.findDebugByCss('ion-row.contact'))
    expect(navControllerStub.push).toHaveBeenCalled()
  })
  it('presents the new contact modal after clicking the new contact button', () => {
    page.clickNewContactButton()
    expect(modalControllerStub.create).toHaveBeenCalledWith(
      'NewContactPage',
      { stageId: undefined },
      { cssClass: 'new-contact-page-modal' }
    )
    expect(modalStub.present).toHaveBeenCalled()
  })
})
