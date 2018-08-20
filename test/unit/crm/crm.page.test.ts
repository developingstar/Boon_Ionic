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
import { initComponent } from '../../support/helpers'
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
      const table = page.contactsTable()
      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Stage',
        'Phone number',
        'Contact owner',
        'Created at'
      ])
      assertTableRow(table.children.item(1), [
        'John Boon',
        'john@example.com',
        'Introduction',
        '+999111111',
        '-',
        '12/01 07:00 AM'
      ])
      assertTableRow(table.children.item(2), [
        'Susan Boon',
        'susan@example.com',
        'Introduction',
        '+999222222',
        '-',
        '12/01 07:00 AM'
      ])
      assertTableRow(table.children.item(3), [
        '-',
        '-',
        'Closed - Won',
        '+999333333',
        'Tom',
        '12/01 07:00 AM'
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
      expect(page.showingFrom().textContent).toEqual('1')
      expect(page.showingTo().textContent).toEqual('50')
      expect(page.showingTotal().textContent).toEqual('1 contacts')
      page.clickNextPageButton()
    })
  })
  describe('pipelines nav', () => {
    it('check header', () => {
      expect(page.getHeader()).toEqual('All Contacts')
      page.selectPipeline(2)
      expect(page.getHeader()).toEqual('Converted')
      page.selectPipeline(3)
      expect(page.getHeader()).toEqual('Without response')
    })
    it('includes items and a default option', () => {
      const nav = page.pipelinesNavElements()
      expect(nav.length).toBe(3)
      expect(nav.item(0).textContent).toBe('All Contacts')
      expect(nav.item(1).textContent).toBe('Converted')
      expect(nav.item(2).textContent).toBe('Without response')
    })
    it('allows to set a filter and to clear it', () => {
      expect(salesServiceStub.contacts).toHaveBeenCalled()
      page.selectPipeline(2)
      expect(salesServiceStub.contacts).toHaveBeenCalled()
      let latestArgs = salesServiceStub.contacts.calls.mostRecent().args
      expect(latestArgs[0].url).toBeNull()
      expect(latestArgs[0].params.get('pipeline_id')).toBe('1')
      page.selectPipeline(1)
      expect(salesServiceStub.contacts).toHaveBeenCalled()
      latestArgs = salesServiceStub.contacts.calls.mostRecent().args
      expect(latestArgs[0].url).toBeNull()
      expect(latestArgs[0].params.get('pipeline_id')).toBe(null)
    })
    it('resets current page on option select', () => {
      page.clickNextPageButton()
      expect(salesServiceStub.contacts).toHaveBeenCalled()
      page.selectPipeline(2)
      expect(salesServiceStub.contacts).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })
    })
    describe('stages nav', () => {
      it('includes items and a default option when pipeline is selected', () => {
        page.selectPipeline(1)
        expect(page.stagesNav()!.hidden).toBeTruthy()
        page.selectPipeline(2)
        expect(page.stagesNav()!.hidden).toBeFalsy()
        const nav = page.stagesNavElements()
        expect(nav.length).toBe(3)
        expect(nav.item(0).textContent).toBe('View All')
        expect(nav.item(0).classList).toContain('view-all-container-selected')
        expect(nav.item(1).textContent).toBe('Introduction')
        expect(nav.item(2).textContent).toBe('Closed - Won')
        page.selectPipeline(1)
        expect(page.stagesNav()!.hidden).toBeTruthy()
      })
      it('allows to set a filter and to clear it', () => {
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        page.selectPipeline(2)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        page.selectStage(2)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        let latestArgs = salesServiceStub.contacts.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe('2')
        page.selectStage(1)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        latestArgs = salesServiceStub.contacts.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe(null)
      })
      it('clears the stage filter on pipeline change', () => {
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        page.selectPipeline(2)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        page.selectStage(2)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        let latestArgs = salesServiceStub.contacts.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe('2')
        page.selectPipeline(2)
        expect(salesServiceStub.contacts).toHaveBeenCalled()
        latestArgs = salesServiceStub.contacts.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe(null)
      })
      it('resets the stage selection on pipeline change', () => {
        page.selectPipeline(2)
        page.selectStage(2)
        let nav = page.stagesNavElements()
        expect(nav.length).toBe(3)
        expect(nav.item(0).textContent).toBe('View All')
        expect(nav.item(1).textContent).toBe('Introduction')
        expect(nav.item(1).classList).toContain('stage-container-selected')
        expect(nav.item(2).textContent).toBe('Closed - Won')
        page.selectPipeline(3)
        nav = page.stagesNavElements()
        expect(nav.length).toBe(2)
        expect(nav.item(0).textContent).toBe('View All')
        expect(nav.item(0).classList).toContain('view-all-container-selected')
        expect(nav.item(1).textContent).toBe('Needs follow-up')
      })
      it('hides stage column when a filter is set', () => {
        page.selectPipeline(2)
        const table = page.contactsTable()
        assertTableRow(table.children.item(0), [
          'Name',
          'Email',
          'Stage',
          'Phone number',
          'Contact owner',
          'Created at'
        ])
        assertTableRow(table.children.item(1), [
          'John Boon',
          'john@example.com',
          'Introduction',
          '+999111111',
          '-',
          '12/01 07:00 AM'
        ])
        page.selectStage(2)
        assertTableRow(table.children.item(0), [
          'Name',
          'Email',
          'Phone number',
          'Contact owner',
          'Created at'
        ])
        assertTableRow(table.children.item(1), [
          'John Boon',
          'john@example.com',
          '+999111111',
          '-',
          '12/01 07:00 AM'
        ])
      })
    })
  })
  it('opens the contact page after clicking an entry in the table', () => {
    page.click(page.findDebugByCss('ion-row.contact'))
    expect(navControllerStub.push).toHaveBeenCalled()
  })
  it('presents the new contact modal after clicking the new contact button', () => {
    page.selectPipeline(2)
    page.selectStage(3)
    page.clickNewContactButton()
    expect(modalControllerStub.create).toHaveBeenCalledWith(
      'NewContactPage',
      { stageId: 1 },
      { cssClass: 'new-contact-page-modal' }
    )
    expect(modalStub.present).toHaveBeenCalled()
  })
})
