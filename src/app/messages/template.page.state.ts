import { Shortcode } from './shortcode.model'

export type UserAction =
  | { readonly name: 'new' }
  | { readonly name: 'create' }
  | { readonly name: 'edit' }
  | { readonly name: 'update' }
  | { readonly name: 'shortcode'; readonly value: string }

export type State<Model, IModel, TemplateFormGroup> =
  | {
      readonly mode: 'init'
    }
  | {
      readonly form: TemplateFormGroup
      readonly shortcodes: ReadonlyArray<Shortcode>
      readonly template: IModel
      readonly mode: 'new'
    }
  | {
      readonly form: TemplateFormGroup
      readonly shortcodes: ReadonlyArray<Shortcode>
      readonly template: Model | undefined
      readonly mode: 'edit'
    }
