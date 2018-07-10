import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Contact } from './contact.model'

export type SortType = 'order_by'

export interface ISetSorter {
  readonly name: 'setSorter'
  readonly type: SortType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetSorter | 'newContact'

export interface IState {
  readonly contacts: PaginatedCollection<Contact>
  readonly requestOptions: IHttpRequestOptions
}

export const initialState: IState = {
  contacts: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  requestOptions: blankHttpRequestOptions
}
