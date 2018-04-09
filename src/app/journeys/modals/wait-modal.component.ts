import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'

import { secondsInOptimalUnit, unitOptions } from '../duration.helpers'
import { IWaitData, IWaitEvent } from './../journeys.api.model'
import { ISelectOption, numberFormControl } from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'wait-modal',
  templateUrl: 'wait-modal.component.html'
})
export class WaitModalComponent {
  public readonly forValue: FormControl
  public readonly unitOptions: ReadonlyArray<ISelectOption> = unitOptions
  public readonly unitSelect: FormControl

  constructor(private viewController: ViewController) {
    if (viewController.data.action === undefined) {
      this.forValue = numberFormControl('')
      this.unitSelect = numberFormControl(60)
    } else {
      const action: IWaitEvent = viewController.data.action
      const values = secondsInOptimalUnit(action.data.for)

      this.forValue = numberFormControl(values.value)
      this.unitSelect = numberFormControl(values.factor)
    }
  }

  public save(): void {
    const data: IWaitData = {
      for: Math.floor(
        Number(this.forValue.value) * Number(this.unitSelect.value)
      )
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }

  get isSaveDisabled(): boolean {
    return this.forValue.invalid || this.unitSelect.invalid
  }
}
