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
      .map(
        (response: API.IGroupResponse) =>
          new Group(response.data.group)
      )
  }

  public groups(): Observable<ReadonlyArray<Group>> {
    return this.http
      .get('/api/groups')
      .map((response: API.IGroupsResponse) =>
        response.data.groups.map((item) => new Group(item))
      )
  }

  public users(group_id: number | null = null): Observable<ReadonlyArray<User>> {
    return this.http
      .get(`/api/groups/${group_id}/users`)
      .map((response: {
        readonly data: {
          readonly users: ReadonlyArray<Auth.API.IUser>
        }
      }) => response.data.users.map((user) => new User(user))
    )
  }
}
