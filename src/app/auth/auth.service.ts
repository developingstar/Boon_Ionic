import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subscription } from 'rxjs'

import { CurrentUserService } from './current-user.service'
import { User } from './user.model'

@Injectable()
export class AuthService {
  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly http: HttpClient
  ) {}

  public login(email: string, password: string): Subscription {
    return this.http
      .post('/api/sessions', {
        user: {
          email: email,
          password: password
        }
      })
      .subscribe(
        (response: { readonly data: { readonly user: Auth.API.IUser } }) => {
          const user = new User(response.data.user)
          this.currentUserService.details.next(user)
        }
      )
  }

  public logout(): void {
    this.currentUserService.details.next(undefined)
  }
}
