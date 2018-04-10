import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { Template } from './template.model'

export type UserAction =
  | { readonly name: 'list' }
  | { readonly name: 'edit'; readonly template: Template }

export interface IState {
  readonly templates: ReadonlyArray<Template>
}

export const initialState: IState = {
  templates: []
}
