import { NavController, PopoverController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
import { EmailTemplate } from './email-template.model'
import { MessagesService } from './messages.service'
import { ActionsResult, TemplateActionsComponent } from './template-actions.component'
import { IState, IUserAction } from './templates.page.state'
import { TextTemplate } from './text-template.model'

export abstract class TemplatesPage<Model> extends ReactivePage<
  IState<Model>,
  IUserAction
> {
  protected abstract readonly resourcePageRoot: string

  constructor(
    initialState: IState<Model>,
    protected navController: NavController,
    protected service: MessagesService,
    protected popoverController: PopoverController,
  ) {
    super(initialState)
  }

  get templates(): Observable<ReadonlyArray<Model>> {
    return this.state.map((state) => state.templates)
  }

  public newTemplate(): void {
    this.navController.setRoot(this.resourcePageRoot, { id: 'new' })
  }

  public show(template: Model): void {
    this.navController.setRoot(this.resourcePageRoot, {
      id: this.templateId(template)
    })
  }

  public showActions(event: any, template: EmailTemplate | TextTemplate): void {
    const popover = this.popoverController.create(
      TemplateActionsComponent.name,
      {
        template: template
      },
      { cssClass: 'boon-popover' }
    )
    popover.present({ ev: event })
    popover.onDidDismiss((data: ActionsResult) => {
      if (data) {
        console.log(data)
      }
    })
  }

  protected initialAction(): IUserAction {
    return { name: 'list' }
  }

  protected abstract templateId(template: Model): number
}
