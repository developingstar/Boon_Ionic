export interface IUserAction {
  readonly name: 'list'
}

export interface IState<T> {
  readonly templates: ReadonlyArray<T>
}
