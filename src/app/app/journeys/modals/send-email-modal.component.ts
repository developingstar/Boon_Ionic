import { Component, OnDestroy } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, ViewController } from 'ionic-angular'
import { Observable, Subscription } from 'rxjs'

import { MessagesService } from './../../messages/messages.service'
import { IEmailTemplateEvent, ISendEmailData } from './../journeys.api.model'
import {
  ISelectOption,
  numberFormControl,
  toSelectOption
} from './event-modal.helpers'

@IonicPage()
@Component({
  selector: 'send-email-modal',
  templateUrl: 'send-email-modal.component.html'
})
export class SendEmailModalComponent implements OnDestroy {
  public readonly sendFromOwnerCheckbox: FormControl
  public readonly templateOptions: Observable<ReadonlyArray<ISelectOption>>
  public readonly templateSelect: FormControl

  private readonly templateSubscription: Subscription

  constructor(
    private viewController: ViewController,
    private messagesService: MessagesService
  ) {
    this.templateOptions = this.messagesService
      .emailTemplates()
      .map(toSelectOption)
    this.templateSubscription = this.templateOptions.subscribe()

    if (viewController.data.action === undefined) {
      this.templateSelect = numberFormControl('')
      this.sendFromOwnerCheckbox = new FormControl(false, Validators.required)
    } else {
      const action: IEmailTemplateEvent = viewController.data.action

      this.templateSelect = numberFormControl(action.data.template_id)
      this.sendFromOwnerCheckbox = new FormControl(
        action.data.send_from_owner,
        Validators.required
      )
    }
  }

  ngOnDestroy(): void {
    this.templateSubscription.unsubscribe()
  }

  public save(): void {
    const data: ISendEmailData = {
      send_from_owner: this.sendFromOwnerCheckbox.value,
      template_id: Number(this.templateSelect.value)
    }

    this.viewController.dismiss(data)
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }
}
