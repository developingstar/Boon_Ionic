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
  contactId: number
  contactFirst: string
  contactLast: string
  contactNumber: string
  messageCount: string
  read: boolean
  isBlank: boolean

  constructor(data: any) {
    this.id = data.id
    this.favorite = data.favorite
    this.lastMessage = data.last_message
    this.lastMessageDate = data.last_message_date
    this.contactId = data.contact_id
    this.contactFirst = data.contact_first
    this.contactLast = data.contact_last
    this.contactNumber = data.contact_number
    this.messageCount = data.message_count
    this.read = data.read
    this.isBlank = data.is_blank || false
  }

  getContactName(): string | undefined {
    if (this.contactFirst && this.contactLast) {
      return `${this.contactFirst} ${this.contactLast}`
    } else if (this.contactFirst || this.contactLast) {
      return this.contactFirst || this.contactLast
    } else {
      return undefined
    }
  }

  getContactDisplayName(): string | undefined {
    if (this.contactFirst || this.contactLast) {
      return this.getContactName()
    } else {
      return this.contactNumber
    }
  }

  setRead(): void {
    this.read = true
  }

  toggleFavorite(): void {
    this.favorite = !this.favorite
  }
}
