import { FormControl, FormGroup } from '@angular/forms'

import { ITextTemplate } from './messages.api.model'
import { Shortcode } from './shortcode.model'
import { TextTemplate } from './text-template.model'

export class TemplateFormGroup extends FormGroup {
  readonly controls: {
    readonly content: FormControl
    readonly default_sender: FormControl
    readonly name: FormControl
  }
  readonly value: {
    readonly content: string
    readonly default_sender: string
    readonly name: string
  }
}

export type State =
  | {
      readonly mode: 'init'
    }
  | {
      readonly form: TemplateFormGroup
      readonly phoneNumbers: ReadonlyArray<string>
      readonly shortcodes: ReadonlyArray<Shortcode>
      readonly template: ITextTemplate
      readonly mode: 'new'
    }
  | {
      readonly form: TemplateFormGroup
      readonly phoneNumbers: ReadonlyArray<string>
      readonly shortcodes: ReadonlyArray<Shortcode>
      readonly template: TextTemplate | undefined
      readonly mode: 'edit'
    }

export const initialState: State = {
  mode: 'init'
}
