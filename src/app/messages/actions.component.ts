import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'
import { EmailTemplate } from './email-template.model'
import { TextTemplate } from './text-template.model'

interface IDeleteTemplateAction {
  readonly name: 'delete_template'
  readonly template: EmailTemplate | TextTemplate
}

export type ActionsResult = IDeleteTemplateAction | null

@IonicPage()
@Component({
  templateUrl: 'actions.component.html'
})
export class ActionsComponent {
  readonly template: EmailTemplate | TextTemplate

  constructor(private viewController: ViewController) {
    this.template = viewController.data.template
  }

  public deleteTemplate(): void {
    this.dismissWith({ name: 'delete_template', template: this.template })
  }

  private dismissWith(action: ActionsResult): void {
    this.viewController.dismiss(action)
  }
}
