import {
  ensureEmail,
  ensureNonEmptyString,
  ensureNumber
} from '../utils/validators'
import * as API from './messages.api.model'

export class EmailTemplate {
  readonly content: string
  readonly defaultSender: string
  readonly defaultSenderName: string | null
  readonly id: number
  readonly name: string
  readonly subject: string
  readonly type: 'email'

  constructor(data: API.IEmailTemplate) {
    this.content = ensureNonEmptyString(data.content)
    this.defaultSender = ensureEmail(data.default_sender)
    this.defaultSenderName = data.default_sender_name
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.subject = ensureNonEmptyString(data.subject)
  }

  get sender(): string {
    if (this.defaultSenderName) {
      return `${this.defaultSenderName} <${this.defaultSender}>`
    } else {
      return `${this.defaultSender}`
    }
  }

  public toApiRepresentation(): API.IEmailTemplate {
    return {
      content: this.content,
      default_sender: this.defaultSender,
      default_sender_name: this.defaultSenderName,
      id: this.id,
      name: this.name,
      subject: this.subject
    }
  }
}
