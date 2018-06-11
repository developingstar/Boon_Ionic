import { Shortcode } from './shortcode.model'

export type UserAction =
  | { readonly name: 'new' }
  | { readonly name: 'create' }
  | { readonly name: 'edit' }
  | { readonly name: 'update' }

export type State<Model, IModel, TemplateFormGroup> =
  | {
      readonly mode: 'init'
    }
  | {
      readonly form: TemplateFormGroup
      readonly template: IModel
      readonly mode: 'new'
    }
  | {
      readonly form: TemplateFormGroup
      readonly template: Model | undefined
      readonly mode: 'edit'
    }
