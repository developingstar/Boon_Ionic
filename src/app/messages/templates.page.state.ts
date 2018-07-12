import { EmailTemplate } from './email-template.model'
import { TextTemplate } from './text-template.model'

export type UserAction =
  | { readonly name: 'list' }
  | { readonly name: 'delete_template'; template: EmailTemplate | TextTemplate }

export interface IState<T> {
  readonly templates: ReadonlyArray<T>
}
