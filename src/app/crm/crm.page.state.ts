import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Lead } from './lead.model'

export type FilterType = 'sort'

export interface ISetFilter {
  readonly name: 'setFilter'
  readonly type: FilterType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetFilter | 'newLead'

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
  requestOptions: blankHttpRequestOptions,
}
