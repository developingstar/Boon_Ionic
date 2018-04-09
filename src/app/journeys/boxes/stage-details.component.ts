import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { SalesService } from '../../crm/sales.service'
import { Stage } from '../../crm/stage.model'
import { IStageEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'stage-details',
  templateUrl: 'box-details.html'
})
export class StageDetailsComponent extends DetailsComponent<
  IStageEvent,
  Stage
> {
  constructor(protected service: SalesService) {
    super()
  }

  protected fetchRecord(): Observable<Stage | undefined> {
    return this.service.stage(this.event.data.stage_id)
  }

  protected detail(object: Stage): string {
    return object.name
  }
}
