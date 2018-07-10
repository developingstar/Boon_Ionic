import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '../../auth/user.model'
import { UsersService } from '../../crm/users.service'
import { IContactOwnerEvent } from '../journeys.api.model'
import { DetailsComponent } from './details.component'

@Component({
  selector: 'contact-owner-details',
  templateUrl: 'box-details.html'
})
export class ContactOwnerDetailsComponent extends DetailsComponent<
  IContactOwnerEvent,
  User
> {
  constructor(protected service: UsersService) {
    super()
  }

  protected fetchRecord(): Observable<User | undefined> {
    return this.service.user(this.event.data.owner_id)
  }

  protected detail(object: User): string {
    return object.name
  }
}
