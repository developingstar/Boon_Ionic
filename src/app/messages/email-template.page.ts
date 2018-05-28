import { Component, ElementRef } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
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
  public selectedShortCode: string = ''
  protected readonly resourcesRootPage: string = 'EmailTemplatesPage'

  constructor(
    navParams: NavParams,
    elRef: ElementRef,
    protected navController: NavController,
    protected messagesService: MessagesService,
    protected toastController: ToastController,
    private currentUserService: CurrentUserService
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
        subject: ''
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

  protected addShortCode(
    state: State,
    shortcode: string = ''
  ): Observable<State> {
    if (state.mode === 'new' || state.mode === 'edit') {
      const form = state.form as TemplateFormGroup
      let content = form.controls.content.value
      const position = document.getElementsByTagName('textarea')[0]
        .selectionStart

      content =
        content.substr(0, position) +
        shortcode +
        content.substr(position, content.length)
      form.controls.content.setValue(content)

      return Observable.of({
        ...state,
        form: form
      })
    } else {
      return Observable.of(state)
    }
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
      shortcode: new FormControl(null),
      subject: new FormControl(values.subject, Validators.required)
    })
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).EmailTemplatePage !== undefined
  }
}
