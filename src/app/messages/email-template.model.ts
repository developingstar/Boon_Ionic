import {
  ensureEmail,
  ensureNonEmptyString,
  ensureNumber
} from '../utils/validators'
import * as API from './messages.api.model'

export class EmailTemplate {
  readonly content: string
  readonly default_sender: string
  readonly default_sender_name: string | null
  readonly id: number
  readonly name: string
  readonly subject: string
  readonly type: 'email'

  constructor(data: API.IEmailTemplate) {
    this.content = ensureNonEmptyString(data.content)
    this.default_sender = ensureEmail(data.default_sender)
    this.default_sender_name = data.default_sender_name
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.subject = ensureNonEmptyString(data.subject)
  }

  get sender(): string {
    if (this.default_sender_name) {
      return `${this.default_sender_name} <${this.default_sender}>`
    } else {
      return `${this.default_sender}`
    }
  }
}
