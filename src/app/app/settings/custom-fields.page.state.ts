import { FormControl } from '@angular/forms'

import { FieldDefinition } from '../crm/field-definition.model'

interface IAction<T extends string> {
  readonly name: T
}

interface IListAction extends IAction<'list'> {}
interface INewAction extends IAction<'new'> {}
interface ICreateAction extends IAction<'create'> {}
interface IEditAction extends IAction<'edit'> {
  readonly field: FieldDefinition
}
interface IUpdateAction extends IAction<'update'> {}

export type UserAction =
  | IListAction
  | INewAction
  | ICreateAction
  | IEditAction
  | IUpdateAction

interface IState<T extends string> {
  readonly mode: T
}

interface IListState extends IState<'list'> {
  readonly fields: ReadonlyArray<FieldDefinition>
}
interface INewState extends IState<'new'> {
  readonly formControl: FormControl
}
interface IEditState extends IState<'edit'> {
  readonly fieldId: number
  readonly formControl: FormControl
}

export type State = IListState | INewState | IEditState

export const initialState: State = {
  fields: [],
  mode: 'list'
}
