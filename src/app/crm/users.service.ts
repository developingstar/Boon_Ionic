import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '../auth/user.model'

@Injectable()
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  public users(): Observable<ReadonlyArray<User>> {
    return this.http
      .get('/api/users')
      .map(
        (response: {
          readonly data: {
            readonly users: ReadonlyArray<Auth.API.IUser>
          }
        }) => response.data.users.map((user) => new User(user))
      )
  }

  public user(id: number): Observable<User> {
    return this.http.get(`/api/users/${id}`).map(
      (response: {
        readonly data: {
          readonly user: Auth.API.IUser
        }
      }) => new User(response.data.user)
    )
  }
}
