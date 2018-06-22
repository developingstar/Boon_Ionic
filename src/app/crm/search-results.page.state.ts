import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Lead } from './lead.model'
import { Deal } from '../deals/deal.model'

export type FilterType = 'pipeline_id' | 'stage_id'

export interface ISetFilter {
  readonly name: 'setFilter'
  readonly type: FilterType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetFilter | 'newLead'

export interface IState {
  readonly leads: PaginatedCollection<Lead> | PaginatedCollection<Deal>
  readonly type: string
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
  type: 'deal'
}
