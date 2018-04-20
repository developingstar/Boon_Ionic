import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { PipelinesPageObject } from './pipelines.page.po'

import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { PipelinesPage } from '../../../src/app/settings/pipelines.page'
import { PipelinesPageModule } from '../../../src/app/settings/pipelines.page.module'

describe('PipelinesPage', () => {
  let fixture: ComponentFixture<PipelinesPage>
  let page: PipelinesPageObject
  let pipelines: Pipeline[]
  let salesServiceStub: any

  beforeEach(async(() => {
    pipelines = [
      { id: 101, name: 'New', stage_order: [] },
      { id: 102, name: 'Converted', stage_order: [] }
    ]

    salesServiceStub = {
      createPipeline: (pipelineData: Crm.API.IPipelineCreate) => {
        const newPipeline = new Pipeline({
          id: 103,
          name: pipelineData.name,
          stage_order: []
        })
        pipelines.push(newPipeline)
        return Observable.of(newPipeline)
      },
      pipelines: () => Observable.of(pipelines),
      stages: () => Observable.of([]),
      updatePipeline: (id: number, pipelineData: Crm.API.IPipelineUpdate) => {
        for (let i = 0; i < pipelines.length; i++) {
          const pipeline = pipelines[i]
          if (pipeline.id === id) {
            pipelines[i] = { ...pipeline, name: pipelineData.name! }
            return Observable.of(pipeline)
          }
        }
        return Observable.of(undefined)
      }
    }

    spyOn(salesServiceStub, 'createPipeline').and.callThrough()
    spyOn(salesServiceStub, 'updatePipeline').and.callThrough()

    const navParamsStub = {
      get: (prop: string) => undefined
    }

    fixture = initComponent(PipelinesPage, {
      imports: [PipelinesPageModule, HttpClientTestingModule],
      providers: [
        NavService,
        { provide: NavController, useValue: new NavControllerStub() },
        { provide: NavParams, useValue: navParamsStub },
        { provide: SalesService, useValue: salesServiceStub }
      ]
    })

    page = new PipelinesPageObject(fixture)

    fixture.detectChanges()
  }))

  describe('listing pipelines', () => {
    it('shows a list of pipelines', () => {
      expect(page.header).toEqual('Pipelines')
      expect(page.pipelines).toEqual(['New', 'Converted'])
    })

    it('shows the add pipeline button', () => {
      expect(page.addPipelineButtonVisible).toBe(true)
    })

    it('shows the new pipeline form after clicking the add pipeline button', () => {
      page.clickAddPipelineButton()
      fixture.detectChanges()

      expect(page.header).toEqual('new Pipeline') // it will be capitalized via CSS
    })
  })

  describe('creating pipeline form', () => {
    beforeEach(() => {
      page.clickAddPipelineButton()
      fixture.detectChanges()
    })

    it('creates a pipeline and shows listing after clicking the save button', () => {
      page.setName('Without Response')
      fixture.detectChanges()
      page.clickSavePipelineButton()
      fixture.detectChanges()

      expect(salesServiceStub.createPipeline).toHaveBeenCalledWith({
        name: 'Without Response'
      })
      expect(page.header).toEqual('Pipelines')
      expect(page.pipelines).toEqual(['New', 'Converted', 'Without Response'])
    })

    it('returns to the listing after clicking the back button', () => {
      page.clickBack()
      fixture.detectChanges()

      expect(page.header).toEqual('Pipelines')
    })

    it('blocks the creation when the name is blank', () => {
      expect(page.savePipelineButtonEnabled).toBe(false)

      page.setName('A New Pipeline')
      fixture.detectChanges()

      expect(page.savePipelineButtonEnabled).toBe(true)
    })
  })

  describe('editing pipeline form', () => {
    beforeEach(() => {
      page.clickPipeline('Converted')
      fixture.detectChanges()
    })

    it('updates a pipeline and shows listing after clicking the save button', () => {
      page.setName('Converted/Archived')
      fixture.detectChanges()
      page.clickSavePipelineButton()
      fixture.detectChanges()

      expect(salesServiceStub.updatePipeline).toHaveBeenCalledWith(102, {
        name: 'Converted/Archived',
        stage_order: []
      })
      expect(page.header).toEqual('Pipelines')
      expect(page.pipelines).toEqual(['New', 'Converted/Archived'])
    })
  })
})
