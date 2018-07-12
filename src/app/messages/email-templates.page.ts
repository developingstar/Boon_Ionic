import { Component } from '@angular/core'
import { IonicPage, NavController, PopoverController, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { showToast } from '../utils/toast'
import { EmailTemplate } from './email-template.model'
import { initialState, IState } from './email-templates.page.state'
import { MessagesService } from './messages.service'
import { TemplatesPage } from './templates.page'
import { UserAction } from './templates.page.state'

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
    private currentUserService: CurrentUserService,
    private readonly toastController: ToastController,
    protected popoverController: PopoverController,
  ) {
    super(initialState, navController, service, popoverController)
  }

  protected templateId(template: EmailTemplate): number {
    return template.id
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'list':
        return this.service
          .emailTemplates()
          .map<ReadonlyArray<EmailTemplate>, IState>((templates) => ({
            templates: templates
          }))
      case 'delete_template':
        return this.service.deleteTemplate(action.template.id).map<
        {
          readonly data: {
            readonly message: string
          }
        },
        IState
      >((response) => {
        showToast(this.toastController, 'Removed user successfully.')
        return {
          ...state,
          templates: state.templates.filter(
            (template) => template.id !== action.template.id
          )
        }
      })
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
