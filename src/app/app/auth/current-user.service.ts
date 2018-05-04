import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { User } from './user.model'

@Injectable()
export class CurrentUserService {
  public readonly details: BehaviorSubject<
    User | undefined
  > = new BehaviorSubject(undefined)

  constructor() {
    this.initializeDetails()

    this.details.subscribe((details) => {
      if (details === undefined) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(details))
      }
    })
  }

  public isAuthenticated(): Observable<boolean> {
    return this.details.map((details) => details !== undefined)
  }

  public role(): Observable<Auth.API.Role | undefined> {
    return this.details.map(
      (details) => (details !== undefined ? details.role : undefined)
    )
  }

  private initializeDetails(): void {
    const maybeRawUser = localStorage.getItem('user')

    if (maybeRawUser === null) {
      this.details.next(undefined)
    } else {
      const user: User = new User(JSON.parse(maybeRawUser))

      this.details.next(user)
    }
  }
}
