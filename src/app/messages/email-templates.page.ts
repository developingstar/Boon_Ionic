import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
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
    protected service: MessagesService,
    private currentUserService: CurrentUserService
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

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).TextTemplatesPage !== undefined
  }
}
