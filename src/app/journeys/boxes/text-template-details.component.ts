import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { MessagesService } from '../../messages/messages.service'
import { TextTemplate } from '../../messages/text-template.model'
import { ITextTemplateEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'text-template-details',
  templateUrl: 'box-details.html'
})
export class TextTemplateDetailsComponent extends DetailsComponent<
  ITextTemplateEvent,
  TextTemplate
> {
  constructor(protected service: MessagesService) {
    super()
  }

  protected fetchRecord(): Observable<TextTemplate | undefined> {
    return this.service.textTemplate(this.event.data.template_id)
  }

  protected detail(object: TextTemplate): string {
    return object.name + this.suffix()
  }

  private suffix(): string {
    return this.event.data.send_from_owner ? ' (contact owner)' : ''
  }
}
