import { BehaviorSubject, Observable } from 'rxjs'

import { User } from '../../src/app/auth/user.model'
import { sampleUser } from './factories'

export class NavControllerStub {
  constructor(public active: {} = { name: 'CrmPage' }) {}

  getActive(): {} {
    return this.active
  }

  setRoot(): void {
    return
  }

  push(): void {
    return
  }

  pop(): void {
    return
  }
}

// tslint:disable-next-line:max-classes-per-file
export class CurrentUserServiceStub {
  private details: BehaviorSubject<User>
  constructor(user?: User) {
    const mergedUser = new User(sampleUser(user))
    this.details = new BehaviorSubject(mergedUser)
  }
  public role(): Observable<Auth.API.Role | undefined> {
    return this.details.map(
      (details) => (details !== undefined ? details.role : undefined)
    )
  }
}
