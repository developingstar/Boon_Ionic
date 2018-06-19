import { HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../../../src/app/api/http-request-options'
import { PaginatedCollection } from '../../../src/app/api/paginated-collection'
import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { Journey } from '../../../src/app/journeys/journey.model'
import { JourneysPage } from '../../../src/app/journeys/journeys.page'
import { JourneysPageModule } from '../../../src/app/journeys/journeys.page.module'
import { JourneysService } from '../../../src/app/journeys/journeys.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleJourney } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { assertTableRow } from '../../support/matchers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { JourneysPageObject } from './journeys.page.po'

describe('JourneysPage', () => {
  let collection: PaginatedCollection<Journey>
  let fixture: ComponentFixture<JourneysPage>
  let page: JourneysPageObject
  let journeysServiceStub: any
  let navControllerStub: any
  let items: any
  beforeEach(
    async(() => {
      items = [
        new Journey(
          sampleJourney({
            id: 1,
            name: 'motivating introduction 1',
            published_at: '2018-03-11T11:07:48Z',
            state: 'active',
            type: 'contact'
          })
        ),
        new Journey(
          sampleJourney({
            id: 2,
            name: 'motivating introduction 2',
            type: 'deal'
          })
        ),
        new Journey(
          sampleJourney({
            id: 3,
            name: 'motivating introduction 3',
            published_at: '2018-03-12T09:16:32Z',
            state: 'active',
            type: 'contact'
          })
        )
      ]

      journeysServiceStub = {
        journeys: (
          options: IHttpRequestOptions = blankHttpRequestOptions,
          category: string = 'contact'
        ) => {
          const journeys = items.filter(
            (journey: Journey) => journey.type === category
          )
          collection = {
            count: 0,
            items: journeys,
            nextPageLink: 'http://example.com/next',
            prevPageLink: 'http://example.com/prev'
          }
          return Observable.of(collection)
        }
      }

      spyOn(journeysServiceStub, 'journeys').and.callThrough()

      navControllerStub = new NavControllerStub({ name: 'JourneysPage' })
      const currentUserServiceStub = new CurrentUserServiceStub()

      spyOn(navControllerStub, 'setRoot').and.callThrough()

      fixture = initComponent(JourneysPage, {
        imports: [JourneysPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: JourneysService, useValue: journeysServiceStub }
        ]
      })

      page = new JourneysPageObject(fixture)

      fixture.detectChanges()
    })
  )

  describe('show journeys', () => {
    it('table', () => {
      const table = page.journeysTable()

      expect(table.children.length).toBe(4)
      assertTableRow(table.children.item(0), [
        'Name',
        'Published',
        'Status',
        ''
      ])
      assertTableRow(table.children.item(1), [
        'motivating introduction 1',
        '03-11-2018',
        'Published',
        ''
      ])
      assertTableRow(table.children.item(2), [
        'motivating introduction 3',
        '03-12-2018',
        'Published',
        ''
      ])
    })

    it('allows to load journeys from different pages', () => {
      expect(journeysServiceStub.journeys).toHaveBeenCalledWith(
        {
          params: jasmine.any(HttpParams),
          url: null
        },
        'contact'
      )

      page.clickNextPageButton()

      expect(journeysServiceStub.journeys).toHaveBeenCalledWith(
        {
          params: jasmine.any(HttpParams),
          url: 'http://example.com/next'
        },
        'contact'
      )

      page.clickPrevPageButton()

      expect(journeysServiceStub.journeys).toHaveBeenCalledWith(
        {
          params: jasmine.any(HttpParams),
          url: 'http://example.com/prev'
        },
        'contact'
      )
    })
  })

  it('clicking an entry in the table opens the journey page', () => {
    page.click(page.findDebugByCss('ion-row.journey ion-col'))

    expect(navControllerStub.setRoot).toHaveBeenCalledWith('JourneyPage', {
      id: collection.items[0].id
    })
  })
})
