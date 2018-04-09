import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'

import { secondsInOptimalUnit } from '../duration.helpers'
import { IWaitEvent } from './../journeys.api.model'

@Component({
  selector: 'wait-details',
  templateUrl: 'box-details.html'
})
export class WaitDetailsComponent {
  @Input() private readonly event: IWaitEvent

  get details(): Observable<string> {
    const record = secondsInOptimalUnit(this.event.data.for)

    return Observable.of(`${record.value} ${record.unit}`)
  }
}
