import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
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
}
