import { EmailTemplate } from './email-template.model'
import * as Generic from './templates.page.state'

export interface IState extends Generic.IState<EmailTemplate> {}

export const initialState: IState = {
  templates: []
}
