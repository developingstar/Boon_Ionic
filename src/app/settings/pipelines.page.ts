import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { AlertController, IonicPage, ModalController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { Pipeline } from '../crm/pipeline.model'
import { SalesService } from '../crm/sales.service'
import { Stage } from '../crm/stage.model'
import { ReactivePage } from '../utils/reactive-page'
import {
  initialState,
  IStageState,
  State,
  UserAction
} from './pipelines.page.state'

@IonicPage({
  segment: 'settings/cms/pipelines'
})
@Component({
  selector: 'pipelines-page',
  templateUrl: 'pipelines.page.html'
})
export class PipelinesPage extends ReactivePage<State, UserAction> {
  isChanged: boolean
  isStageChanged: boolean
  originalPipeline: Pipeline

  constructor(
    public alertCtrl: AlertController,
    private readonly modalCtrl: ModalController,
    private readonly salesService: SalesService
  ) {
    super(initialState)
  }

  nameChanged(value: string): void {
    this.isChanged = this.originalPipeline.name !== value ? true : false
    this.isChanged = this.isChanged || this.isStageChanged
  }

  ionViewCanLeave(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        buttons: [
          {
            handler: () => {
              this.uiActions.next({ name: 'update' })
              resolve(true)
            },
            text: 'Save'
          },
          {
            handler: () => {
              resolve(true)
            },
            text: "Don't Save"
          }
        ],
        subTitle:
          'You have chaged somethingsomething. Do you want to save them?',
        title: 'Confirm'
      })
      if (!this.isChanged) resolve(true)
      else alert.present()
    })
  }

  addStage(): void {
    const addStageModal = this.modalCtrl.create(
      'EditStageModalPage',
      { title: 'Add new stage' },
      { cssClass: 'edit-stage-modal' }
    )

    addStageModal.onDidDismiss(
      (data: { readonly name: string } | undefined) => {
        if (data !== undefined) {
          const newStage = { edited: true, id: undefined, name: data.name }
          this.uiActions.next({ name: 'add-stage', stage: newStage })
        }
      }
    )

    addStageModal.present()
  }

  editStage(stage: IStageState): void {
    const editStageModal = this.modalCtrl.create(
      'EditStageModalPage',
      { initialName: stage.name, title: 'Edit stage' },
      { cssClass: 'edit-stage-modal' }
    )

    editStageModal.onDidDismiss(
      (data: { readonly name: string } | undefined) => {
        if (data !== undefined) {
          this.uiActions.next({
            name: 'edit-stage',
            newName: data.name,
            stage: stage
          })
        }
      }
    )

    editStageModal.present()
  }

  editPipeline(pipeline: Pipeline): void {
    this.originalPipeline = new Pipeline({
      id: pipeline.id,
      name: pipeline.name,
      stage_order: pipeline.stageOrder
    })
    this.uiActions.next({ name: 'edit', pipeline: pipeline })
  }

  goBackToList(): void {
    this.uiActions.next({ name: 'list' })
  }

  newPipeline(): void {
    this.uiActions.next({ name: 'new' })
  }

  createPipeline(): void {
    this.uiActions.next({ name: 'create' })
  }

  updatePipeline(): void {
    this.uiActions.next({ name: 'update' })
  }

  get currentPipelineNameInput(): Observable<FormControl | undefined> {
    return this.state.map(
      (state) =>
        state.mode === 'edit' || state.mode === 'new'
          ? state.nameInput
          : undefined
    )
  }

  get currentPipelineStages(): Observable<ReadonlyArray<IStageState>> {
    return this.state.map((state) => {
      if (state.mode === 'edit' || state.mode === 'new') {
        return state.stages
      } else {
        return []
      }
    })
  }

  get formInvalid(): Observable<boolean> {
    return this.state.map(
      (state) =>
        (state.mode === 'new' || state.mode === 'edit') &&
        !state.nameInput.valid
    )
  }

  get mode(): Observable<string> {
    return this.state.map((state) => state.mode)
  }

  get pipelines(): Observable<ReadonlyArray<Pipeline>> {
    return this.state.map((state) => {
      if (state.mode === 'list') {
        return state.pipelines
      } else {
        return []
      }
    })
  }

  get showList(): Observable<boolean> {
    return this.mode.map((mode) => mode === 'list')
  }

  get showForm(): Observable<boolean> {
    return this.mode.map((mode) => mode === 'edit' || mode === 'new')
  }

  protected initialAction(): UserAction {
    return { name: 'list' }
  }

  protected reduce(state: State, action: UserAction): Observable<State> {
    const listPipelines = this.salesService
      .pipelines()
      .map<ReadonlyArray<Pipeline>, State>((pipelines) => ({
        mode: 'list',
        pipelines: pipelines
      }))

    if (action.name === 'list') {
      return listPipelines
    } else if (action.name === 'new') {
      return Observable.of<State>({
        mode: 'new',
        nameInput: new FormControl('', Validators.required),
        stages: []
      })
    } else if (action.name === 'create' && state.mode === 'new') {
      return this.salesService
        .createPipeline({ name: state.nameInput.value })
        .concatMap((pipeline) =>
          this.saveStagesAndUpdatePipeline(state.stages, pipeline)
        )
        .concatMap(() => listPipelines)
    } else if (action.name === 'update' && state.mode === 'edit') {
      return this.saveStagesAndUpdatePipeline(state.stages, {
        ...state.pipeline,
        name: state.nameInput.value
      }).concatMap(() => listPipelines)
    } else if (
      action.name === 'add-stage' &&
      (state.mode === 'edit' || state.mode === 'new')
    ) {
      this.isStageChanged = true
      return Observable.of({
        ...state,
        stages: state.stages.concat(action.stage)
      })
    } else if (
      action.name === 'edit-stage' &&
      (state.mode === 'edit' || state.mode === 'new')
    ) {
      this.isStageChanged = true
      return Observable.of({
        ...state,
        stages: this.updateStageName(state.stages, action.stage, action.newName)
      })
    } else if (action.name === 'edit') {
      return this.salesService.stages(action.pipeline.id).map((stages) => {
        const stagesState: ReadonlyArray<
          IStageState
        > = action.pipeline.stageOrder
          .map((stageId) => stages.find((stage) => stage.id === stageId))
          .filter((stage) => stage !== undefined)
          .map((stage: Stage) => ({
            edited: false,
            id: stage.id,
            name: stage.name
          }))
        return {
          mode: 'edit',
          nameInput: new FormControl(action.pipeline.name, Validators.required),
          pipeline: action.pipeline,
          stages: stagesState
        }
      }) as Observable<State>
    } else {
      return Observable.of(state)
    }
  }

  private saveStagesAndUpdatePipeline(
    stages: ReadonlyArray<IStageState>,
    pipeline: Pipeline
  ): Observable<Pipeline> {
    return Observable.from(stages)
      .concatMap((stage) => {
        if (stage.edited) {
          if (stage.id === undefined) {
            return this.salesService
              .createStage(pipeline.id, { name: stage.name })
              .map((newStage) => newStage.id)
          } else {
            return this.salesService
              .updateStage(stage.id, { name: stage.name })
              .map(() => stage.id as number)
          }
        } else {
          return Observable.of(stage.id as number)
        }
      })
      .toArray()
      .concatMap((newStageOrder) =>
        this.salesService.updatePipeline(pipeline.id, {
          name: pipeline.name,
          stage_order: newStageOrder
        })
      )
  }

  private updateStageName(
    stages: ReadonlyArray<IStageState>,
    stage: IStageState,
    newName: string
  ): ReadonlyArray<IStageState> {
    return stages.map((s) => {
      if (s === stage) {
        return { ...s, edited: true, name: newName }
      } else {
        return s
      }
    })
  }
}
