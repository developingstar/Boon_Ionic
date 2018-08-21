import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
import { MessagesService } from './messages.service'
import { IState, IUserAction } from './templates.page.state'

export abstract class TemplatesPage<Model> extends ReactivePage<
  IState<Model>,
  IUserAction
> {
  protected abstract readonly resourcePageRoot: string

  constructor(
    initialState: IState<Model>,
    protected navController: NavController,
    protected service: MessagesService
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

  protected initialAction(): IUserAction {
    return { name: 'list' }
  }

  protected abstract templateId(template: Model): number
}
