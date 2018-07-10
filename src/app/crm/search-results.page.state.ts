import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { PaginatedList } from '../api/paginated-list'
import { Deal } from '../deals/deal.model'
import { Contact } from './contact.model'

export type UserAction =
  | { readonly name: 'init'; readonly category: string }
  | { readonly name: 'prev' }
  | { readonly name: 'next' }

export interface IState {
  readonly results: PaginatedCollection<Contact> | PaginatedList<Deal>
  readonly type: string
  readonly requestOptions: IHttpRequestOptions
}

export const initialState: IState = {
  requestOptions: blankHttpRequestOptions,
  results: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  type: 'deal'
}
