import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

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
  let journeysServiceStub: JourneysService
  let navControllerStub: any

  beforeEach(
    async(() => {
      collection = {
        count: 0,
        items: [
          new Journey(
            sampleJourney({
              id: 1,
              name: 'motivating introduction 1',
              published_at: '2018-03-11T11:07:48Z',
              state: 'active'
            })
          ),
          new Journey(
            sampleJourney({
              id: 2,
              name: 'motivating introduction 2'
            })
          ),
          new Journey(
            sampleJourney({
              id: 3,
              name: 'motivating introduction 3',
              published_at: '2018-03-12T09:16:32Z',
              state: 'active'
            })
          )
        ],
        nextPageLink: 'http://example.com/next',
        prevPageLink: 'http://example.com/prev'
      }

      const httpClient = new HttpClient(
        new class extends HttpHandler {
          handle(req: any): Observable<any> {
            return Observable.never()
          }
        }()
      )

      journeysServiceStub = new JourneysService(httpClient)
      journeysServiceStub.journeys = () => Observable.of(collection)

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

  describe('table', () => {
    it('includes journeys', () => {
      const table = page.journeysTable()

      expect(table.children.length).toBe(5)
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
        'motivating introduction 2',
        '-',
        'Draft',
        ''
      ])
      assertTableRow(table.children.item(3), [
        'motivating introduction 3',
        '03-12-2018',
        'Published',
        ''
      ])
    })

    it('allows to load journeys from different pages', () => {
      expect(journeysServiceStub.journeys).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: null
      })

      page.clickNextPageButton()

      expect(journeysServiceStub.journeys).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/next'
      })

      page.clickPrevPageButton()

      expect(journeysServiceStub.journeys).toHaveBeenCalledWith({
        params: jasmine.any(HttpParams),
        url: 'http://example.com/prev'
      })
    })
  })

  it('clicking an entry in the table opens the journey page', () => {
    page.click(page.findDebugByCss('ion-row.journey ion-col'))

    expect(navControllerStub.setRoot).toHaveBeenCalledWith('JourneyPage', {
      id: collection.items[0].id
    })
  })
})
