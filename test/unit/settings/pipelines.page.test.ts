import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import {
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { PipelinesPageObject } from './pipelines.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { PipelinesPage } from '../../../src/app/settings/pipelines.page'
import { PipelinesPageModule } from '../../../src/app/settings/pipelines.page.module'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'

describe('PipelinesPage', () => {
  let fixture: ComponentFixture<PipelinesPage>
  let modalStub: any
  let modalControllerStub: any
  let page: PipelinesPageObject
  let pipelines: Pipeline[]
  let salesServiceStub: any
  let stages: Stage[]
  let toastControllerStub: any
  let toastStub: any

  beforeEach(
    async(() => {
      pipelines = [
        { id: 101, name: 'New', stageOrder: [] },
        { id: 102, name: 'Converted', stageOrder: [3, 1] }
      ]

      stages = [
        { pipelineId: 102, name: 'Stage1', id: 1 },
        { pipelineId: 102, name: 'Stage2', id: 2 },
        { pipelineId: 101, name: 'Stage3', id: 3 },
        { pipelineId: 101, name: 'Stage4', id: 4 }
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
        stages: () => Observable.of(stages),
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

      modalStub = {
        onDidDismiss: (stageName: string) => {
          return stageName
        },
        present: () => {
          return
        }
      }

      spyOn(modalStub, 'present').and.callThrough()
      spyOn(modalStub, 'onDidDismiss').and.callThrough()

      modalControllerStub = {
        create: () => modalStub
      }

      spyOn(modalControllerStub, 'create').and.callThrough()

      const currentUserServiceStub = new CurrentUserServiceStub()
      toastStub = {
        present: () => {
          return
        }
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(toastStub, 'present').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()

      fixture = initComponent(PipelinesPage, {
        imports: [PipelinesPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: new NavControllerStub() },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavParams, useValue: navParamsStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: ModalController, useValue: modalControllerStub },
          { provide: ToastController, useValue: toastControllerStub }
        ]
      })
      page = new PipelinesPageObject(fixture)
      fixture.detectChanges()
    })
  )
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
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Created pipeline successfully.'
      })
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

    it('shows a list of stages', () => {
      expect(page.header).toEqual('edit Pipeline')
      expect(page.stages).toEqual(['Stage3', 'Stage1'])
    })

    it('presents the new stage modal after clicking the new stage button', () => {
      page.clickAddStageButton()

      expect(modalControllerStub.create).toHaveBeenCalledWith(
        'EditStageModalPage',
        { title: 'Add new stage' },
        { cssClass: 'edit-stage-modal' }
      )
      expect(modalStub.present).toHaveBeenCalled()
    })

    it('show the edit stage modal after clicking the stage', () => {
      page.clickStage('Stage3')

      expect(modalControllerStub.create).toHaveBeenCalledWith(
        'EditStageModalPage',
        { initialName: 'Stage3', title: 'Edit stage' },
        { cssClass: 'edit-stage-modal' }
      )
      expect(modalStub.present).toHaveBeenCalled()
    })

    it('updates a pipeline and shows listing after clicking the save button', () => {
      page.setName('Converted/Archived')
      fixture.detectChanges()
      page.clickSavePipelineButton()
      fixture.detectChanges()
      expect(salesServiceStub.updatePipeline).toHaveBeenCalledWith(102, {
        name: 'Converted/Archived',
        stage_order: [3, 1]
      })
      expect(page.header).toEqual('Pipelines')
      expect(page.pipelines).toEqual(['New', 'Converted/Archived'])
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Updated pipeline successfully.'
      })
    })
  })
})
