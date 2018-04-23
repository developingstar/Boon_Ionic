import * as Generic from './templates.page.state'
import { TextTemplate } from './text-template.model'

export interface IState extends Generic.IState<TextTemplate> {}

export const initialState: IState = {
  templates: []
}
