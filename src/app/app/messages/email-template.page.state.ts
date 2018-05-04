import { FormControl, FormGroup } from '@angular/forms'

import { EmailTemplate } from './email-template.model'
import { IEmailTemplate } from './messages.api.model'
import * as Generic from './template.page.state'

export class TemplateFormGroup extends FormGroup {
  readonly controls: {
    readonly content: FormControl
    readonly default_sender: FormControl
    readonly defaultSenderName: FormControl
    readonly name: FormControl
    readonly subject: FormControl
  }
  readonly value: {
    readonly content: string
    readonly default_sender: string
    readonly defaultSenderName: string
    readonly name: string
    readonly subject: string
  }
}

export type State = Generic.State<
  EmailTemplate,
  IEmailTemplate,
  TemplateFormGroup
>

export const initialState: State = {
  mode: 'init'
}
