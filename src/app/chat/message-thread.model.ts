export class MessageThread {
  static findConversationPosition(conversations: any, data: any): number {
    let convPos: number = 0

    for (let i = 0; i < conversations.length; i++) {
      if (conversations[i].id === data.message.conversation_id) {
        convPos = i
      }
    }
    return convPos
  }

  id: number
  favorite: boolean
  lastMessage: string
  lastMessageDate: string
  leadId: number
  leadFirst: string
  leadLast: string
  leadNumber: string
  messageCount: string
  read: boolean
  isBlank: boolean

  constructor(data: any) {
    this.id = data.id
    this.favorite = data.favorite
    this.lastMessage = data.last_message
    this.lastMessageDate = data.last_message_date
    this.leadId = data.lead_id
    this.leadFirst = data.lead_first
    this.leadLast = data.lead_last
    this.leadNumber = data.lead_number
    this.messageCount = data.message_count
    this.read = data.read
    this.isBlank = data.is_blank || false
  }

  getLeadName(): string | undefined {
    if (this.leadFirst && this.leadLast) {
      return `${this.leadFirst} ${this.leadLast}`
    } else if (this.leadFirst || this.leadLast) {
      return this.leadFirst || this.leadLast
    } else {
      return undefined
    }
  }

  getLeadDisplayName(): string | undefined {
    if (this.leadFirst || this.leadLast) {
      return this.getLeadName()
    } else {
      return this.leadNumber
    }
  }

  setRead(): void {
    this.read = true
  }

  toggleFavorite(): void {
    this.favorite = !this.favorite
  }
}
