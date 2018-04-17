import { HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { ModalController, NavController } from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { PaginatedCollection } from '../../../src/app/api/paginated-collection'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { CrmPage } from '../../../src/app/crm/crm.page'
import { CrmPageModule } from '../../../src/app/crm/crm.page.module'
import { Lead } from '../../../src/app/crm/lead.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { NavService } from '../../../src/app/nav/nav.service'
import {
  sampleLead,
  samplePipeline,
  sampleStage,
  sampleUser
} from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { NavControllerStub } from '../../support/stubs'
import { CrmPageObject } from './crm.page.po'

describe('CrmPage', () => {
  let collection: PaginatedCollection<Lead>
  let fixture: ComponentFixture<CrmPage>
  let page: CrmPageObject
  let salesServiceStub: any
  let navControllerStub: any
  let modalStub: any
  let modalControllerStub: any

  beforeEach(
    async(() => {
      const user: User = sampleUser({
        name: 'Tom'
      })

      collection = {
        items: [
          sampleLead({
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Boon',
            phone_number: '+999111111',
            stage_id: 2
          }),
          sampleLead({
            email: 'susan@example.com',
            firstName: 'Susan',
            lastName: 'Boon',
            phone_number: '+999222222',
            stage_id: 2
          }),
          sampleLead({
            email: null,
            firstName: null,
            lastName: null,
            owner: user,
            phone_number: '+999333333',
            stage_id: 1
          })
        ],
        nextPageLink: 'http://example.com/next',
        prevPageLink: 'http://example.com/prev'
      }

      salesServiceStub = {
        leads: () => Observable.of(collection),
        pipelines: () =>
          Observable.of([
            samplePipeline({ id: 1, name: 'Converted', stage_order: [2, 1] }),
            samplePipeline({ id: 2, name: 'Without response' })
          ]),
        stages: () =>
          Observable.of([
            sampleStage({ id: 1, name: 'Closed - Won', pipeline_id: 1 }),
            sampleStage({ id: 2, name: 'Introduction', pipeline_id: 1 }),
            sampleStage({ id: 3, name: 'Needs follow-up', pipeline_id: 2 })
          ])
      }

      spyOn(salesServiceStub, 'leads').and.callThrough()

      const currentUserServiceStub = {
        details: new BehaviorSubject(user)
      }

      navControllerStub = new NavControllerStub()

      spyOn(navControllerStub, 'setRoot').and.callThrough()

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
    it('includes leads', () => {
      const table = page.leadsTable()

      expect(table.children.length).toBe(5)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Stage',
        'Phone number',
        'Contact owner'
      ])
      assertTableRow(table.children.item(1), [
        'John Boon',
        'john@example.com',
        'Introduction',
        '+999111111',
        '-'
      ])
      assertTableRow(table.children.item(2), [
        'Susan Boon',
        'susan@example.com',
        'Introduction',
        '+999222222',
        '-'
      ])
      assertTableRow(table.children.item(3), [
        '-',
        '-',
        'Closed - Won',
        '+999333333',
        'Tom'
      ])
    })

    it('allows to load leads from different pages', () => {
      expect(salesServiceStub.leads).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })

      page.clickNextPageButton()

      expect(salesServiceStub.leads).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/next'
      })

      page.clickPrevPageButton()

      expect(salesServiceStub.leads).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/prev'
      })
    })
  })

  describe('pipelines nav', () => {
    it('includes items and a default option', () => {
      const nav = page.pipelinesNavElements()

      expect(nav.length).toBe(3)
      expect(nav.item(0).textContent).toBe('All Contacts')
      expect(nav.item(1).textContent).toBe('Converted')
      expect(nav.item(2).textContent).toBe('Without response')
    })

    it('allows to set a filter and to clear it', () => {
      expect(salesServiceStub.leads).toHaveBeenCalled()

      page.selectPipeline(2)

      expect(salesServiceStub.leads).toHaveBeenCalled()
      let latestArgs = salesServiceStub.leads.calls.mostRecent().args
      expect(latestArgs[0].url).toBeNull()
      expect(latestArgs[0].params.get('pipeline_id')).toBe('1')

      page.selectPipeline(1)

      expect(salesServiceStub.leads).toHaveBeenCalled()
      latestArgs = salesServiceStub.leads.calls.mostRecent().args
      expect(latestArgs[0].url).toBeNull()
      expect(latestArgs[0].params.get('pipeline_id')).toBe(null)
    })

    it('resets current page on option select', () => {
      page.clickNextPageButton()

      expect(salesServiceStub.leads).toHaveBeenCalledTimes(2)

      page.selectPipeline(2)

      expect(salesServiceStub.leads).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })
    })

    describe('stages nav', () => {
      it('includes items and a default option when pipeline is selected', () => {
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
        expect(salesServiceStub.leads).toHaveBeenCalled()
        page.selectPipeline(2)
        expect(salesServiceStub.leads).toHaveBeenCalled()

        page.selectStage(2)

        expect(salesServiceStub.leads).toHaveBeenCalled()
        let latestArgs = salesServiceStub.leads.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe('2')

        page.selectStage(1)

        expect(salesServiceStub.leads).toHaveBeenCalled()
        latestArgs = salesServiceStub.leads.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe(null)
      })

      it('clears the stage filter on pipeline change', () => {
        expect(salesServiceStub.leads).toHaveBeenCalled()
        page.selectPipeline(2)
        expect(salesServiceStub.leads).toHaveBeenCalled()

        page.selectStage(2)

        expect(salesServiceStub.leads).toHaveBeenCalled()
        let latestArgs = salesServiceStub.leads.calls.mostRecent().args
        expect(latestArgs[0].url).toBeNull()
        expect(latestArgs[0].params.get('stage_id')).toBe('2')

        page.selectPipeline(2)

        expect(salesServiceStub.leads).toHaveBeenCalled()
        latestArgs = salesServiceStub.leads.calls.mostRecent().args
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

        const table = page.leadsTable()

        assertTableRow(table.children.item(0), [
          'Name',
          'Email',
          'Stage',
          'Phone number',
          'Contact owner'
        ])
        assertTableRow(table.children.item(1), [
          'John Boon',
          'john@example.com',
          'Introduction',
          '+999111111',
          '-'
        ])

        page.selectStage(2)

        assertTableRow(table.children.item(0), [
          'Name',
          'Email',
          'Phone number',
          'Contact owner'
        ])
        assertTableRow(table.children.item(1), [
          'John Boon',
          'john@example.com',
          '+999111111',
          '-'
        ])
      })
    })
  })

  it('opens the lead page after clicking an entry in the table', () => {
    page.click(page.findDebugByCss('ion-row.lead'))

    expect(navControllerStub.setRoot).toHaveBeenCalledWith('LeadPage', {
      id: collection.items[0].id
    })
  })

  it('presents the new lead modal after clicking the new contact button', () => {
    page.selectPipeline(2)
    page.selectStage(3)
    page.clickNewContactButton()

    expect(modalControllerStub.create).toHaveBeenCalledWith(
      'NewLeadPage',
      { stageId: 1 },
      { cssClass: 'new-lead-page-modal' }
    )
    expect(modalStub.present).toHaveBeenCalled()
  })
})
