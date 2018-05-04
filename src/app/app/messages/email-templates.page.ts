import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { EmailTemplate } from './email-template.model'
import { initialState, IState } from './email-templates.page.state'
import { MessagesService } from './messages.service'
import { TemplatesPage } from './templates.page'
import { IUserAction } from './templates.page.state'

@IonicPage({
  segment: 'email-templates'
})
@Component({
  selector: 'email-templates-page',
  templateUrl: 'email-templates.page.html'
})
export class EmailTemplatesPage extends TemplatesPage<EmailTemplate> {
  protected readonly resourcePageRoot: string = 'EmailTemplatePage'

  constructor(
    protected navController: NavController,
    protected service: MessagesService
  ) {
    super(initialState, navController, service)
  }

  protected templateId(template: EmailTemplate): number {
    return template.id
  }

  protected reduce(state: IState, action: IUserAction): Observable<IState> {
    switch (action.name) {
      case 'list':
        return this.service
          .emailTemplates()
          .map<ReadonlyArray<EmailTemplate>, IState>((templates) => ({
            templates: templates
          }))
    }
  }
}
