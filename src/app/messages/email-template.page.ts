import { Component, ElementRef, ViewChild } from '@angular/core'
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
  public ckeConfig: any
  public content: string
  @ViewChild('templateEditor') templateEditor: any
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

    this.content = ''
    this.ckeConfig = {
      allowedContent: true,
      toolbar: 'Basic',
      toolbar_Basic: [
        [
          'Font',
          '-',
          'FontSize',
          '-',
          'Bold',
          'Italic',
          'Underline',
          'TextColor',
          'BGColor',
          '-',
          'JustifyLeft',
          'JustifyCenter',
          'JustifyRight',
          'JustifyBlock'
        ]
      ]
    }
  }

  onChange($event: any): void {
    return
  }

  protected new(state: State): Observable<State> {
    if (state.mode === 'init') {
      const mode: State['mode'] = 'new'
      const newTemplate: IEmailTemplate = {
        content: '',
        default_sender: '',
        default_sender_name: '',
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
      template: {
        content: this.content,
        default_sender: form.value.default_sender,
        default_sender_name: form.value.default_sender_name,
        name: form.value.name,
        subject: form.value.subject
      }
    })
  }

  protected addShortCode(
    state: State,
    shortcode: string = ''
  ): Observable<State> {
    if (state.mode === 'new' || state.mode === 'edit') {
      this.content += shortcode
    }
    return Observable.of(state)
  }

  protected edit(state: State): Observable<State> {
    const mode: State['mode'] = 'edit'
    const fetchShortcodes = this.messagesService.shortcodes()
    const fetchTemplate = this.messagesService.emailTemplate(this.templateID)
    return Observable.zip(
      fetchTemplate,
      fetchShortcodes,
      (template: EmailTemplate, shortcodes) => {
        this.content = template.content
        return {
          ...state,
          form: this.createFormGroup(template.toApiRepresentation()),
          mode: mode,
          shortcodes: shortcodes,
          template: template
        }
      }
    )
  }

  protected updateTemplate(
    id: number,
    form: TemplateFormGroup
  ): Observable<EmailTemplate> {
    return this.messagesService.updateEmailTemplate(id, {
      template: {
        content: this.content,
        default_sender: form.value.default_sender,
        default_sender_name: form.value.default_sender_name,
        name: form.value.name,
        subject: form.value.subject
      }
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
