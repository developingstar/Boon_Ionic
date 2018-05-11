import { Component } from '@angular/core'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { FormControl, Validators } from '@angular/forms'
import { phoneNumberValidator } from '../utils/form-validators'
import { ITextTemplate } from './messages.api.model'
import { MessagesService } from './messages.service'
import { PhoneNumbersService } from './phone-numbers.service'
import { TemplatePage } from './template.page'
import { TextTemplate } from './text-template.model'
import {
  initialState,
  State,
  TemplateFormGroup
} from './text-template.page.state'

@IonicPage({
  segment: 'text-template/:id'
})
@Component({
  selector: 'text-template-page',
  templateUrl: 'text-template.page.html'
})
export class TextTemplatePage extends TemplatePage<
  TextTemplate,
  ITextTemplate,
  TemplateFormGroup
> {
  protected readonly resourcesRootPage: string = 'TextTemplatesPage'

  constructor(
    navParams: NavParams,
    protected navController: NavController,
    protected messagesService: MessagesService,
    protected toastController: ToastController,
    private phoneNumbersService: PhoneNumbersService
  ) {
    super(
      initialState,
      navParams,
      navController,
      messagesService,
      toastController
    )
  }

  get phoneNumbers(): Observable<ReadonlyArray<string>> {
    return this.state.flatMap((state: State) => {
      if (state.mode === 'init') {
        return Observable.empty()
      } else {
        return Observable.of(state.phoneNumbers)
      }
    })
  }

  protected new(state: State): Observable<State> {
    if (state.mode === 'init') {
      const mode: State['mode'] = 'new'
      const fetchPhoneNumbers = this.phoneNumbersService.getAll()
      const fetchShortcodes = this.messagesService.shortcodes()
      const newTemplate: ITextTemplate = {
        content: '',
        default_sender: '',
        name: ''
      }

      return Observable.zip(
        fetchPhoneNumbers,
        fetchShortcodes,
        (phoneNumbers, shortcodes) => ({
          ...state,
          form: this.createFormGroup(newTemplate),
          mode: mode,
          phoneNumbers: phoneNumbers,
          shortcodes: shortcodes,
          template: newTemplate
        })
      )
    } else {
      return Observable.of(state)
    }
  }

  protected createTemplate(form: TemplateFormGroup): Observable<TextTemplate> {
    return this.messagesService.createTextTemplate({
      template: form.value
    })
  }

  protected edit(state: State): Observable<State> {
    const mode: State['mode'] = 'edit'
    const fetchPhoneNumbers = this.phoneNumbersService.getAll()
    const fetchShortcodes = this.messagesService.shortcodes()
    const fetchTemplate = this.messagesService.textTemplate(this.templateID)

    return Observable.zip(
      fetchPhoneNumbers,
      fetchShortcodes,
      fetchTemplate,
      (phoneNumbers, shortcodes, template: TextTemplate) => ({
        ...state,
        form: this.createFormGroup(template.toApiRepresentation()),
        mode: mode,
        phoneNumbers: phoneNumbers,
        shortcodes: shortcodes,
        template: template
      })
    )
  }

  protected addShortCode(state: State): Observable<State>  {
    return Observable.of(state)
  }

  protected updateTemplate(
    id: number,
    form: TemplateFormGroup
  ): Observable<TextTemplate> {
    return this.messagesService.updateTextTemplate(id, {
      template: form.value
    })
  }

  protected getTemplateId(template: TextTemplate): number {
    return template.id
  }

  protected createFormGroup(
    values: ITextTemplate | undefined = {
      content: '',
      default_sender: '',
      name: ''
    }
  ): TemplateFormGroup {
    return new TemplateFormGroup({
      content: new FormControl(values.content, Validators.required),
      default_sender: new FormControl(values.default_sender, [
        phoneNumberValidator(),
        Validators.required
      ]),
      name: new FormControl(values.name, Validators.required)
    })
  }
}
