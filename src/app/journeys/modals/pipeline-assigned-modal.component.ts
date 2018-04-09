import { Component, OnDestroy } from '@angular/core'
import { FormControl } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { SalesService } from './../../crm/sales.service'
import { IPipelineAssignedData, IPipelineEvent } from './../journeys.api.model'
import {
  ISelectOption,
  numberFormControl,
  toSelectOption
} from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'pipeline-assigned-modal',
  templateUrl: 'pipeline-assigned-modal.component.html'
})
export class PipelineAssignedModalComponent implements OnDestroy {
  public readonly pipelineOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly pipelineSelect: FormControl

  private readonly pipelineSubscription: Subscription

  constructor(
    private viewController: ViewController,
    private salesService: SalesService
  ) {
    this.pipelineOptions = this.salesService.pipelines().map(toSelectOption)
    this.pipelineSubscription = this.pipelineOptions.subscribe()

    if (viewController.data.trigger === undefined) {
      this.pipelineSelect = numberFormControl('')
    } else {
      const trigger: IPipelineEvent = viewController.data.trigger

      this.pipelineSelect = numberFormControl(trigger.data.pipeline_id)
    }
  }

  ngOnDestroy(): void {
    this.pipelineSubscription.unsubscribe()
  }

  public save(): void {
    const data: IPipelineAssignedData = {
      pipeline_id: Number(this.pipelineSelect.value)
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }
}
