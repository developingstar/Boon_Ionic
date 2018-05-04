import { Component, OnDestroy } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { IFieldEvent, IFieldUpdatedData } from '../journeys.api.model'
import { SalesService } from './../../crm/sales.service'
import {
  ISelectOption,
  numberFormControl,
  toSelectOption
} from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'field-updated-modal',
  templateUrl: 'field-updated-modal.component.html'
})
export class FieldUpdatedModalComponent implements OnDestroy {
  public readonly fieldOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly fieldSelect: FormControl
  public readonly fieldValue: FormControl

  private readonly fieldSubscription: Subscription

  constructor(
    private viewController: ViewController,
    private salesService: SalesService
  ) {
    this.fieldOptions = this.salesService.fields().map(toSelectOption)
    this.fieldSubscription = this.fieldOptions.subscribe()

    if (viewController.data.trigger === undefined) {
      this.fieldSelect = numberFormControl('')
      this.fieldValue = new FormControl('', Validators.required)
    } else {
      const trigger: IFieldEvent = viewController.data.trigger

      this.fieldSelect = numberFormControl(trigger.data.field_id)
      this.fieldValue = new FormControl(trigger.data.value, Validators.required)
    }
  }

  ngOnDestroy(): void {
    this.fieldSubscription.unsubscribe()
  }

  public save(): void {
    const data: IFieldUpdatedData = {
      field_id: Number(this.fieldSelect.value),
      value: this.fieldValue.value
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }
}
