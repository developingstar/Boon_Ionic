import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { MessagesService } from './messages.service'
import { TemplatesPage } from './templates.page'
import { IUserAction } from './templates.page.state'
import { TextTemplate } from './text-template.model'
import { initialState, IState } from './text-templates.page.state'

@IonicPage({
  segment: 'text-templates'
})
@Component({
  selector: 'text-templates-page',
  templateUrl: 'text-templates.page.html'
})
export class TextTemplatesPage extends TemplatesPage<TextTemplate> {
  protected readonly resourcePageRoot: string = 'TextTemplatePage'

  constructor(
    protected navController: NavController,
    protected service: MessagesService,
    private currentUserService: CurrentUserService
  ) {
    super(initialState, navController, service)
  }

  protected templateId(template: TextTemplate): number {
    return template.id
  }

  protected reduce(state: IState, action: IUserAction): Observable<IState> {
    switch (action.name) {
      case 'list':
        return this.service
          .textTemplates()
          .map<ReadonlyArray<TextTemplate>, IState>((templates) => ({
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
