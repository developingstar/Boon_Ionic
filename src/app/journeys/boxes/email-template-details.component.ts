import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { EmailTemplate } from '../../messages/email-template.model'
import { MessagesService } from '../../messages/messages.service'
import { IEmailTemplateEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'email-template-details',
  templateUrl: 'box-details.html'
})
export class EmailTemplateDetailsComponent extends DetailsComponent<
  IEmailTemplateEvent,
  EmailTemplate
> {
  constructor(protected service: MessagesService) {
    super()
  }

  protected fetchRecord(): Observable<EmailTemplate | undefined> {
    return this.service.emailTemplate(this.event.data.template_id)
  }

  protected detail(object: EmailTemplate): string {
    return object.name + this.suffix()
  }

  private suffix(): string {
    return this.event.data.send_from_owner ? ' (contact owner)' : ''
  }
}
