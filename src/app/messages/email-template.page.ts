import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { emailValidator } from '../utils/form-validators'
import { EmailTemplate } from './email-template.model'
import {
  initialState,
  State,
  TemplateFormGroup
} from './email-template.page.state'
import { IEmailTemplate } from './messages.api.model'
import { MessagesService } from './messages.service'
import { TemplatePage } from './template.page'

@IonicPage({
  segment: 'email-template/:id'
})
@Component({
  selector: 'email-template-page',
  templateUrl: 'email-template.page.html'
})
export class EmailTemplatePage extends TemplatePage<
  EmailTemplate,
  IEmailTemplate,
  TemplateFormGroup
> {
  public shortcode: string
  protected readonly resourcesRootPage: string = 'EmailTemplatesPage'

  constructor(
    navParams: NavParams,
    protected navController: NavController,
    protected messagesService: MessagesService,
    protected toastController: ToastController
  ) {
    super(
      initialState,
      navParams,
      navController,
      messagesService,
      toastController
    )
  }

  protected new(state: State): Observable<State> {
    if (state.mode === 'init') {
      const mode: State['mode'] = 'new'
      const newTemplate: IEmailTemplate = {
        content: '',
        default_sender: '',
        default_sender_name: null,
        name: '',
        shortcode: null,
        subject: '',
      }
      return this.messagesService.shortcodes().map((shortcodes) => ({
        ...state,
        form: this.createFormGroup(newTemplate),
        mode: mode,
        shortcodes: shortcodes,
        template: newTemplate
      }))
    } else {
      return Observable.of(state)
    }
  }

  protected createTemplate(form: TemplateFormGroup): Observable<EmailTemplate> {
    return this.messagesService.createEmailTemplate({
      template: form.value
    })
  }

  protected edit(state: State): Observable<State> {
    const mode: State['mode'] = 'edit'
    const fetchShortcodes = this.messagesService.shortcodes()
    const fetchTemplate = this.messagesService.emailTemplate(this.templateID)

    return Observable.zip(
      fetchTemplate,
      fetchShortcodes,
      (template: EmailTemplate, shortcodes) => ({
        ...state,
        form: this.createFormGroup(template.toApiRepresentation()),
        mode: mode,
        shortcodes: shortcodes,
        template: template
      })
    )
  }

  protected updateTemplate(
    id: number,
    form: TemplateFormGroup
  ): Observable<EmailTemplate> {
    return this.messagesService.updateEmailTemplate(id, {
      template: form.value
    })
  }

  protected getTemplateId(template: EmailTemplate): number {
    return template.id
  }

  protected createFormGroup(
    values: IEmailTemplate | undefined = {
      content: '',
      default_sender: '',
      default_sender_name: '',
      name: '',
      shortcode: null,
      subject: ''
    }
  ): TemplateFormGroup {
    return new TemplateFormGroup({
      content: new FormControl(values.content, Validators.required),
      default_sender: new FormControl(values.default_sender, [
        emailValidator(),
        Validators.required
      ]),
      default_sender_name: new FormControl(values.default_sender_name || ''),
      name: new FormControl(values.name, Validators.required),
      shortcode: new FormControl(values.shortcode),
      subject: new FormControl(values.subject, Validators.required)
    })
  }
}
