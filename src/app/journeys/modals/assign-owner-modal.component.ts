import { Component, OnDestroy } from '@angular/core'
import { FormControl } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { UsersService } from '../../crm/users.service'
import { IAssignOwnerData, IContactOwnerEvent } from './../journeys.api.model'
import {
  ISelectOption,
  numberFormControl,
  toSelectOption
} from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'assign-owner-modal',
  templateUrl: 'assign-owner-modal.component.html'
})
export class AssignOwnerModalComponent implements OnDestroy {
  public readonly ownerOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly ownerSelect: FormControl

  private readonly ownerSubscription: Subscription

  constructor(
    private viewController: ViewController,
    private usersService: UsersService
  ) {
    this.ownerOptions = this.usersService.users().map(toSelectOption)
    this.ownerSubscription = this.ownerOptions.subscribe()

    if (viewController.data.action === undefined) {
      this.ownerSelect = numberFormControl('')
    } else {
      const action: IContactOwnerEvent = viewController.data.action

      this.ownerSelect = numberFormControl(action.data.owner_id)
    }
  }

  ngOnDestroy(): void {
    this.ownerSubscription.unsubscribe()
  }

  public save(): void {
    const data: IAssignOwnerData = {
      owner_id: Number(this.ownerSelect.value)
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }
}
