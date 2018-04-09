import { Service } from './service.model'

interface IAction<T extends string> {
  readonly name: T
}

interface IInitAction extends IAction<'init'> {}

interface IUpdateAction extends IAction<'update_service'> {}

export type UserAction =
  | IInitAction
  | IUpdateAction

export interface IState {
  readonly isLoading: boolean
  readonly service?: Service
}

export const initialState: IState = {
  isLoading: false,
  service: undefined
}
