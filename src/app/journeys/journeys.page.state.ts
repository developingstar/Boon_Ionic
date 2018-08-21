import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from '../api/http-request-options'
import { PaginatedCollection } from '../api/paginated-collection'
import { Journey } from './journey.model'

interface IAction<T extends string> {
  readonly name: T
}

interface IInitAction extends IAction<'init'> {}
interface IPrevAction extends IAction<'prev'> {}
interface INextAction extends IAction<'next'> {}

interface IStopJourneyAction extends IAction<'stop_journey'> {
  readonly journey: Journey
}

interface IPublishJourneyAction extends IAction<'publish_journey'> {
  readonly journey: Journey
}

export type UserAction =
  | IInitAction
  | IPrevAction
  | INextAction
  | IStopJourneyAction
  | IPublishJourneyAction

export interface IState {
  readonly isLoading: boolean
  readonly journeys: PaginatedCollection<Journey>
  readonly requestOptions: IHttpRequestOptions
}

export const initialState: IState = {
  isLoading: false,
  journeys: {
    count: 0,
    items: [],
    nextPageLink: null,
    prevPageLink: null
  },
  requestOptions: blankHttpRequestOptions
}
