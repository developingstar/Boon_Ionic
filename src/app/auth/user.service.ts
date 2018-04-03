import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from './user.model'

@Injectable()
export class UserService {
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
}
