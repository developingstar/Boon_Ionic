import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Lead } from './lead.model'
import { Deal } from '../deals/deal.model'

export type UserAction =
  | { readonly name: 'init'; readonly category: string; }
  | { readonly name: 'prev' }
  | { readonly name: 'next' }

export interface IState {
  readonly results: PaginatedCollection<Lead> | PaginatedCollection<Deal>
  readonly type: string
  readonly requestOptions: IHttpRequestOptions
}

export const initialState: IState = {
  results: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  requestOptions: blankHttpRequestOptions,
  type: 'deal',
}
