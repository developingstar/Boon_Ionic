import { Component } from '@angular/core'
import { IonicPage, NavController, PopoverController, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ObservableInput } from '../../../node_modules/rxjs/Observable'
import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { showToast } from '../utils/toast'
import { MessagesService } from './messages.service'
import { TemplatesPage } from './templates.page'
import { UserAction } from './templates.page.state'
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
    private currentUserService: CurrentUserService,
    private toastController: ToastController,
    protected popoverController: PopoverController,
  ) {
    super(initialState, navController, service, popoverController)
  }

  protected templateId(template: TextTemplate): number {
    return template.id
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'list':
        return this.service
          .textTemplates()
          .map<ReadonlyArray<TextTemplate>, IState>((templates) => ({
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
          showToast(this.toastController, 'Removed template successfully.')
          return {
            ...state,
            templates: state.templates.filter(
              (template) => template.id !== action.template.id
            )
          }
        }).catch((error: any, caught: Observable<IState>): ObservableInput<IState> => {
          if (error.status === 422) {
            const errors = error.error.errors
            if (errors) {
              const detail = errors[1].detail
              showToast(
                this.toastController,
                detail,
                2000,
                false
              )
            }
          } else {
            showToast(
              this.toastController,
              'Unknown issue',
              2000,
              false
            )
          }
          return Observable.of(state)
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
