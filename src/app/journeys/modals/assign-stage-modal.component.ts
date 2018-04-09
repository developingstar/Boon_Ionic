import { Component, OnDestroy } from '@angular/core'
import { FormControl } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { Pipeline } from '../../crm/pipeline.model'
import { SalesService } from './../../crm/sales.service'
import { IAssignStageData, IStageEvent } from './../journeys.api.model'
import {
  ISelectOption,
  numberFormControl,
  toSelectOption
} from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'assign-stage-modal',
  templateUrl: 'assign-stage-modal.component.html'
})
export class AssignStageModalComponent implements OnDestroy {
  public readonly pipelineOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly pipelineSelect: FormControl
  public readonly stageOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly stageSelect: FormControl

  private readonly pipelineSubscription: Subscription
  private readonly stageOptionsSubscription: Subscription

  constructor(
    private viewController: ViewController,
    private salesService: SalesService
  ) {
    const action: IStageEvent = viewController.data.action
    const pipelinesResponse = this.salesService.pipelines().shareReplay()

    this.pipelineSelect = numberFormControl('')
    this.pipelineOptions = pipelinesResponse.map(toSelectOption)
    this.pipelineSubscription = pipelinesResponse.subscribe((pipelines) => {
      if (action) {
        const selectedPipeline = this.pipelineByStageId(
          pipelines,
          action.data.stage_id
        )

        if (selectedPipeline !== undefined) {
          this.pipelineSelect.setValue(selectedPipeline.id)
        }
      }
    })

    const changes: Observable<number | null> = this.pipelineSelect.valueChanges

    this.stageSelect = numberFormControl('')
    this.stageOptions = changes.flatMap(this.fetchStageOptions.bind(this))
    this.stageOptionsSubscription = this.stageOptions.subscribe()

    if (action) {
      this.stageSelect.setValue(action.data.stage_id)
    }
  }

  ngOnDestroy(): void {
    this.pipelineSubscription.unsubscribe()
    this.stageOptionsSubscription.unsubscribe()
  }

  public save(): void {
    const data: IAssignStageData = {
      stage_id: Number(this.stageSelect.value)
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }

  private fetchStageOptions(
    pipelineId: number
  ): Observable<ReadonlyArray<ISelectOption>> {
    return this.salesService
      .stages(pipelineId)
      .map(toSelectOption)
      .shareReplay(1)
  }

  private pipelineByStageId(
    pipelines: ReadonlyArray<Pipeline>,
    id: number
  ): Pipeline | undefined {
    return pipelines.find(
      (pipeline) =>
        pipeline.stage_order.find((stageId) => stageId === id) !== undefined
    )
  }
}
