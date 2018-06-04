export class Message {
  id: number
  body: string
  createdAt: Date
  updatedAt: Date
  direction: string
  from: string
  read: string
  conversationId: number
  representativeId: number
  status: string
  to: string

  constructor(data: any) {
    this.id = data.id
    this.body = data.body
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.direction = data.direction
    this.from = data.from
    this.read = data.read
    this.conversationId = data.conversation_id
    this.representativeId = data.representative_id
    this.status = data.status
    this.to = data.to
  }
}
