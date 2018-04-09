import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { FieldDefinition } from '../../crm/field-definition.model'
import { SalesService } from '../../crm/sales.service'
import { IFieldEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'field-details',
  templateUrl: 'box-details.html'
})
export class FieldDetailsComponent extends DetailsComponent<
  IFieldEvent,
  FieldDefinition
> {
  constructor(protected service: SalesService) {
    super()
  }

  protected fetchRecord(): Observable<FieldDefinition | undefined> {
    return this.service.field(this.event.data.field_id)
  }

  protected detail(object: FieldDefinition): string {
    return object.name
  }
}
