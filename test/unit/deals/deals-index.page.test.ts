import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { PaginatedList } from '../../../src/app/api/paginated-list'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Deal } from '../../../src/app/deals/deal.model'
import { DealsIndexPage } from '../../../src/app/deals/deals-index.page'
import { DealsIndexPageModule } from '../../../src/app/deals/deals-index.page.module'
import { DealsService } from '../../../src/app/deals/deals.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleDeal, sampleUser } from '../../support/factories'
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
      collection = {
        items: [
          new Deal(
            sampleDeal({
              email: 'Tyler@fight.com',
              name: 'Sample Deal',
              owner: null,
              pipline: 'New',
              stage_id: 1,
              value: 10000
            })
          ),
          new Deal(
            sampleDeal({
              email: 'boon@example.com',
              name: 'Another Deal',
              owner: null,
              pipline: 'New',
              stage_id: 2,
              value: 10000
            })
          ),
          new Deal(
            sampleDeal({
              email: 'example@boon.com',
              name: null,
              owner: null,
              pipline: null,
              stage_id: 1,
              value: null
            })
          )
        ],
        nextPageLink: 'http://example.com/next',
        prevPageLink: 'http://example.com/prev'
      }
      dealsServiceStub = {
        deals: () => Observable.of(collection)
      }
      spyOn(dealsServiceStub, 'deals').and.callThrough()
      const currentUserServiceStub = new CurrentUserServiceStub(user)
      navControllerStub = new NavControllerStub()
      spyOn(navControllerStub, 'setRoot').and.callThrough()
      fixture = initComponent(DealsIndexPage, {
        imports: [DealsIndexPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: DealsService, useValue: dealsServiceStub }
        ]
      })
      page = new DealsIndexPageObject(fixture)
      fixture.detectChanges()
    })
  )
  describe('table', () => {
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
        'Tyler@fight.com',
        '-',
        '-',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(2), [
        'Another Deal',
        'boon@example.com',
        '-',
        '-',
        '10000',
        '-'
      ])
      assertTableRow(table.children.item(3), [
        '-',
        'example@boon.com',
        '-',
        '-',
        '-',
        '-'
      ])
    })
    it('allows to load deals from different pages', () => {
      expect(dealsServiceStub.deals).toHaveBeenCalledWith(undefined)
      page.clickNextPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith(
        'http://example.com/next'
      )
      page.clickPrevPageButton()
      expect(dealsServiceStub.deals).toHaveBeenCalledWith(
        'http://example.com/prev'
      )
    })
  })
})
