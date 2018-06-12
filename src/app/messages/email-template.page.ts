import { Component, ViewChild } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { CKEditorComponent } from 'ng2-ckeditor'
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
declare var CKEDITOR: any
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
  @ViewChild('templateEditor') templateEditor: CKEditorComponent
  protected readonly resourcesRootPage: string = 'EmailTemplatesPage'

  constructor(
    navParams: NavParams,
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
    CKEDITOR.plugins.addExternal(
      'strinsert',
      '/assets/ckeditor_plugin/',
      'plugin.js'
    )
    this.content = ''
  }

  public setCKEditorConfiguration(shortcodes: any): void {
    const shortcodeList = shortcodes.map((shortcode: any) => {
      return {
        label: shortcode.name,
        name: shortcode.name,
        value: `{{ ${shortcode.shortcode} }}`
      }
    })
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'strinsert',
      strinsert_strings: shortcodeList,
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
          'JustifyBlock',
          '-',
          'strinsert'
        ]
      ]
    }
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
      return this.messagesService.shortcodes().map((shortcodes) => {
        this.setCKEditorConfiguration(shortcodes)
        return {
          ...state,
          form: this.createFormGroup(newTemplate),
          mode: mode,
          shortcodes: shortcodes,
          template: newTemplate
        }
      })
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

  protected edit(state: State): Observable<State> {
    const mode: State['mode'] = 'edit'
    const fetchShortcodes = this.messagesService.shortcodes()
    const fetchTemplate = this.messagesService.emailTemplate(this.templateID)
    return Observable.zip(
      fetchTemplate,
      fetchShortcodes,
      (template: EmailTemplate, shortcodes) => {
        this.content = template.content
        this.setCKEditorConfiguration(shortcodes)
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

  protected addShortCode(
    state: State,
    shortcode: string = ''
  ): Observable<State> {
    return Observable.of(state)
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
      default_sender: new FormControl(values.default_sender, [
        emailValidator(),
        Validators.required
      ]),
      default_sender_name: new FormControl(values.default_sender_name || ''),
      name: new FormControl(values.name, Validators.required),
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
