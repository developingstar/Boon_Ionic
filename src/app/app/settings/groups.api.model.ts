export interface IGroup {
  readonly id: number
  readonly name: string
}

export interface IGroupResponse {
  readonly data: {
    readonly group: IGroup
  }
}

export interface IGroupsResponse {
  readonly data: {
    readonly groups: ReadonlyArray<IGroup>
  }
}

export interface IGroupCreate {
  readonly name: string
}

export interface IGroupUpdate {
  readonly name: string
}
