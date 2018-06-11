import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Lead } from './lead.model'

export type FilterType = 'pipeline_id' | 'stage_id'

export interface ISetFilter {
  readonly name: 'setFilter'
  readonly type: FilterType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetFilter | 'newLead'

export interface IState {
  readonly leads: PaginatedCollection<Lead>
  readonly pipelineId: string | undefined
  readonly requestOptions: IHttpRequestOptions
  readonly stageId: string | undefined
}

export const initialState: IState = {
  leads: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  pipelineId: undefined,
  requestOptions: blankHttpRequestOptions,
  stageId: undefined
}
