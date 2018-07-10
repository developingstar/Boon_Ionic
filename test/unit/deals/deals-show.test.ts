import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { Deal } from '../../../src/app/deals/deal.model'
import { DealsShowPage } from '../../../src/app/deals/deals-show.page'
import { DealsShowPageModule } from '../../../src/app/deals/deals-show.page.module'
import { DealsService } from '../../../src/app/deals/deals.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { sampleContact, sampleDeal, sampleUser } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'

import { Contact } from '../../../src/app/crm/contact.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { TabService } from '../../../src/app/show-tabs/tab.service'
import { DealsShowPageObject } from './deals-show.page.po'

describe('DealsShowPage', () => {
  let deal: Deal
  let dealsServiceStub: any
  let fixture: ComponentFixture<DealsShowPage>
  let navControllerStub: any
  let tabServiceStub: any
  let salesServiceStub: any
  let stages: ReadonlyArray<Stage>
  let stage: Stage
  let page: DealsShowPageObject

  beforeEach(
    async(() => {
      const owner: Auth.API.IUser = sampleUser({
        name: 'Tom'
      })

      const contact: Crm.API.IContact = sampleContact({
        email: 'leeess@gmail.com',
        name: 'Lisa Newman',
        phoneNUmber: '234332111'
      })

      stages = [
        {
          id: 10,
          name: 'Enrolling',
          pipelineId: 504
        },
        {
          id: 14,
          name: 'Signing',
          pipelineId: 504
        },
        {
          id: 15,
          name: 'Closing - Won',
          pipelineId: 504
        }
      ]
      stage = stages[1]
      deal = new Deal(
        sampleDeal({
          contact: contact,
          owner: owner
        })
      )

      dealsServiceStub = {
        getDeal: () => Observable.of(deal),
        updateDeal: () => Observable.of(deal)
      }

      navControllerStub = new NavControllerStub()
      tabServiceStub = {
        getContact: () => Observable.of(new Contact(sampleContact())),
        getDeal: () => Observable.of(deal),
        setContact: () => null,
        setDeal: () => null
      }
      salesServiceStub = {
        getContact: () => Observable.of([]),
        notes: () => Observable.of([]),
        stage: (id: number) => Observable.of(stage),
        stages: (pipelineId: number) => Observable.of(stages)
      }
      const navParamsStub = {
        get: (prop: string) => undefined
      }

      const currentUserServiceStub = new CurrentUserServiceStub()

      spyOn(dealsServiceStub, 'getDeal').and.callThrough()
      spyOn(dealsServiceStub, 'updateDeal').and.callThrough()
      spyOn(navControllerStub, 'pop').and.callThrough()

      fixture = initComponent(DealsShowPage, {
        imports: [DealsShowPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: DealsService, useValue: dealsServiceStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: TabService, useValue: tabServiceStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub }
        ]
      })

      page = new DealsShowPageObject(fixture)
      fixture.detectChanges()
    })
  )

  it('it should be in view mode when opened', () => {
    const viewValues = page.getViewValues()
    const editValues = page.getEditVales()

    expect(viewValues[0].innerHTML).toEqual('10000')
    expect(viewValues.length).toEqual(5)
    expect(editValues.length).toEqual(0)
  })

  it('it goes into edit mode with edit is clicked', () => {
    page.clickUpdateButton()
    fixture.detectChanges()

    const viewValues = page.getViewValues()
    const editValues = page.getEditVales()
    const dealNameInput = editValues[0] as HTMLFormElement

    expect(dealNameInput.value).toEqual('Sample Deal')
    expect(viewValues.length).toEqual(4)
    expect(editValues.length).toEqual(2)
  })
})
