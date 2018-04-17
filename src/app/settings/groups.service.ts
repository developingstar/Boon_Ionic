import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '../auth/user.model'
import { Group } from './group.model'
import * as API from './groups.api.model'

@Injectable()
export class GroupsService {
  constructor(private readonly http: HttpClient) {}

  public group(id: number): Observable<Group | undefined> {
    return this.http
      .get(`/api/groups/${id}`)
      .map((response: API.IGroupResponse) => new Group(response.data.group))
  }

  public groups(): Observable<ReadonlyArray<Group>> {
    return this.http
      .get('/api/groups')
      .map((response: API.IGroupsResponse) =>
        response.data.groups.map((item) => new Group(item))
      )
  }

  public createGroup(name: string): Observable<Group> {
    return this.http
      .post(`/api/groups`, JSON.stringify({ group: { name: name } }))
      .map(
        (response: {
          readonly data: {
            readonly group: Group
          }
        }) => new Group(response.data.group)
      )
  }

  public updateGroup(id: number, name: string): Observable<Group> {
    return this.http
      .patch(`/api/groups/${id}`, JSON.stringify({ group: { name: name } }))
      .map(
        (response: {
          readonly data: {
            readonly group: Group
          }
        }) => new Group(response.data.group)
      )
  }

  public groupUsers(
    group_id: number | null = null
  ): Observable<ReadonlyArray<User>> {
    return this.http
      .get(`/api/groups/${group_id}/users`)
      .map(
        (response: {
          readonly data: {
            readonly users: ReadonlyArray<Auth.API.IUser>
          }
        }) => response.data.users.map((user) => user)
      )
  }

  public addUser(
    group_id: number,
    user_id: number
  ): Observable<{
    readonly data: {
      readonly message: string
    }
  }> {
    return this.http
      .post(`/api/groups/${group_id}/users/${user_id}`, JSON.stringify({}))
      .map((response: { readonly data: { readonly message: string } }) => {
        return response
      })
  }

  public deleteUser(
    group_id: number,
    user_id: number
  ): Observable<{
    readonly data: {
      readonly message: string
    }
  }> {
    return this.http
      .delete(`/api/groups/${group_id}/users/${user_id}`)
      .map((response: { readonly data: { readonly message: string } }) => {
        return response
      })
  }
}
