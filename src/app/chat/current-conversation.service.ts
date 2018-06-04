import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { CurrentConversation } from './current-conversation.model'
// import * as API from './messages.api.model'

@Injectable()
export class CurrentConversationService {
  readonly currentConversation: CurrentConversation = new CurrentConversation()
  readonly notify = new Subject<any>()
  readonly notifyObservable = this.notify.asObservable()

  public openConversation(data: any): void {
    this.currentConversation.setConversation(data)

    if (this.currentConversation) {
      this.notify.next(this.currentConversation)
    }
  }
}
