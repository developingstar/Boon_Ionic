import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Contact } from './contact.model'

export type FilterType = 'pipeline_id' | 'stage_id'

export interface ISetFilter {
  readonly name: 'setFilter'
  readonly type: FilterType
  readonly value: string | undefined
}

export type UserAction = 'init' | 'prev' | 'next' | ISetFilter | 'newContact'

export interface IState {
  readonly contacts: PaginatedCollection<Contact>
  readonly pipelineId: string | undefined
  readonly requestOptions: IHttpRequestOptions
  readonly stageId: string | undefined
}

export const initialState: IState = {
  contacts: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  pipelineId: undefined,
  requestOptions: blankHttpRequestOptions,
  stageId: undefined
}
