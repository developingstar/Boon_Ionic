import { Component, EventEmitter, Input, Output } from '@angular/core'

import { AlertService } from '../../../settings/alert.service'
import { ChatService } from '../../chat.service'
import { CurrentConversationService } from '../../current-conversation.service'
import { MessageThread } from '../../message-thread.model'

@Component({
  selector: 'chat-index-list',
  templateUrl: 'chat-index-list.component.html'
})
export class ChatIndexListComponent {
  @Output() conversationRemoved = new EventEmitter()
  @Input() threads: MessageThread[]
  public selectedIndex: number

  constructor(
    public chatService: ChatService,
    public currentConversationService: CurrentConversationService,
    public alertService: AlertService
  ) {}

  selectedClass(index: number): object {
    return { selected: this.selectedIndex === index }
  }

  getFavoritedAndSelected(index: number, favorite: string): object {
    return {
      favorited: favorite,
      selected: this.selectedIndex === index
    }
  }

  starType(isFavorite: boolean): string {
    return isFavorite
      ? 'assets/icon/messages/star.svg'
      : 'assets/icon/messages/star-empty.svg'
  }

  openConversation(thread: MessageThread, index: number): void {
    this.currentConversationService.openConversation({
      option: 'current_conversation',
      value: [thread, index]
    })
  }

  confirmDeleteThread(thread: MessageThread, index: number): void {
    this.alertService.showRemoveConfirmDialog(
      'Are you sure you want to remove this conversation?',
      () => {
        this.chatService.deleteConversation(thread.id)
        this.threads.splice(index, 1)
        this.openConversation(this.threads[0], 0)
      },
      null
    )
  }
}
