import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { Pipeline } from '../../crm/pipeline.model'
import { SalesService } from '../../crm/sales.service'
import { IPipelineEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'pipeline-details',
  templateUrl: 'box-details.html'
})
export class PipelineDetailsComponent extends DetailsComponent<
  IPipelineEvent,
  Pipeline
> {
  constructor(protected service: SalesService) {
    super()
  }

  protected fetchRecord(): Observable<Pipeline | undefined> {
    return this.service.pipeline(this.event.data.pipeline_id)
  }

  protected detail(object: Pipeline): string {
    return object.name
  }
}
