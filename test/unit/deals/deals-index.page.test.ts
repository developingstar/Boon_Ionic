import { HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { PaginatedList } from '../../../src/app/api/paginated-list'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { Deal } from '../../../src/app/deals/deal.model'
import { DealsIndexPage } from '../../../src/app/deals/deals-index.page'
import { DealsIndexPageModule } from '../../../src/app/deals/deals-index.page.module'
import { DealsService } from '../../../src/app/deals/deals.service'
import { NavService } from '../../../src/app/nav/nav.service'
import {
  sampleContact,
  sampleDeal,
  samplePipeline,
  sampleStage,
  sampleUser
} from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { DealsIndexPageObject } from './deals-index.page.po'

describe('DealsIndexPage', () => {
  let collection: PaginatedList<Deal>
  let fixture: ComponentFixture<DealsIndexPage>
  let page: DealsIndexPageObject
  let navControllerStub: any
  let dealsServiceStub: any
  beforeEach(
    async(() => {
      const user: User = new User(
        sampleUser({
          name: 'Tom'
        })
      )
      const contact: Crm.API.IContact = sampleContact({
        email: 'leeess@gmail.com',
        name: 'Lisa Newman',
        phoneNUmber: '234332111'
      })
      const pipelines = [
        new Pipeline(
          samplePipeline({
            id: 1,
            name: 'Sample Pipeline',
            stageOrder: []
          })
        ),
        new Pipeline(
          samplePipeline({
            id: 2,
            name: 'Needs Followup',
            stageOrder: []
          })
        ),
        new Pipeline(
          samplePipeline({
            id: 3,
            name: 'Closed',
            stageOrder: []
          })
        )
      ]

      const stages = [
        new Stage(
          sampleStage({
            id: 1,
            name: 'Converted',
            pipeline_id: 1
          })
        ),
        new Stage(
          sampleStage({
            id: 2,
            name: 'sample stage',
            pipeline_id: 3
          })
        ),
        new Stage(
          sampleStage({
            id: 3,
            name: 'Converted again',
            pipeline_id: 1
          })
        )
      ]
      collection = {
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
        nextPageLink: 'http://example.com/next',
        prevPageLink: 'http://example.com/prev',
        totalCount: 123
      }
      dealsServiceStub = {
        allStages: () => Observable.of(stages),
        deals: () => Observable.of(collection),
        pipelines: () => Observable.of(pipelines)
      }

      spyOn(dealsServiceStub, 'deals').and.callThrough()
      spyOn(dealsServiceStub, 'pipelines').and.callThrough()
      const currentUserServiceStub = new CurrentUserServiceStub(user)
      navControllerStub = new NavControllerStub()
      const salesServiceStub = {
        stages: () => Observable.of(stages)
      }
      spyOn(navControllerStub, 'setRoot').and.callThrough()
      fixture = initComponent(DealsIndexPage, {
        imports: [DealsIndexPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: DealsService, useValue: dealsServiceStub },
          { provide: SalesService, useValue: salesServiceStub }
        ]
      })
      page = new DealsIndexPageObject(fixture)
      fixture.detectChanges()
    })
  )
  describe('table', () => {
    it('total count of deals', () => {
      expect(page.showingTotal().textContent).toEqual('123 Total')
      page.clickNextPageButton()
    })
    it('includes deals', () => {
      const table = page.dealsTable()
      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Pipeline',
        'Stage',
        'Deal Value',
        'Deal Owner'
      ])
      assertTableRow(table.children.item(1), [
        'Sample Deal',
        '-',
        'Sample Pipeline',
        'Converted',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(2), [
        'Another Deal',
        'leeess@gmail.com',
        'Closed',
        'sample stage',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(3), [
        '-',
        '-',
        'Sample Pipeline',
        'Converted',
        '-',
        '-'
      ])
    })
    it('allows to load deals from different pages', () => {
      expect(dealsServiceStub.deals).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })
      page.clickNextPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/next'
      })
      page.clickPrevPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/prev'
      })
    })
  })
  describe('pipeline dropdown', () => {
    it('pipeline column in table not visible when pipeline selected', () => {
      fixture.componentInstance.selected = new Pipeline(
        samplePipeline({
          id: 1,
          name: 'Sample Pipeline',
          stageOrder: []
        })
      )
      fixture.componentInstance.onSelection()
      fixture.detectChanges()
      const table = page.dealsTable()
      assertTableRow(table.children.item(0), [
        'Name',
        'Email',
        'Stage',
        'Deal Value',
        'Deal Owner'
      ])
      assertTableRow(table.children.item(1), [
        'Sample Deal',
        '-',
        'Converted',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(2), [
        'Another Deal',
        'leeess@gmail.com',
        'sample stage',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(3), ['-', '-', 'Converted', '-', '-'])
    })
  })
})
