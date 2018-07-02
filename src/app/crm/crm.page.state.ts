import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Lead } from './lead.model'

export type SortType = 'order_by'

export interface ISetSorter {
  readonly name: 'setSorter'
  readonly type: SortType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetSorter | 'newLead'

export interface IState {
  readonly leads: PaginatedCollection<Lead>
  readonly requestOptions: IHttpRequestOptions
}

export const initialState: IState = {
  leads: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  requestOptions: blankHttpRequestOptions
}
