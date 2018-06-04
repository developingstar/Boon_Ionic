import { MessageThread } from './message-thread.model'

export class CurrentConversation {
  offset: number
  limit: number
  threadData: MessageThread
  index: number

  setConversation(data: any): void {
    this.offset = 0
    this.limit = 16
    if (data.option && data.option === 'current_conversation') {
      this.threadData = data.value[0]
      this.index = data.value[1]
    }
  }
}
