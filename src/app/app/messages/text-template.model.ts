import {
  ensureNonEmptyString,
  ensureNumber,
  ensurePhoneNumber
} from '../utils/validators'
import * as API from './messages.api.model'

export class TextTemplate {
  readonly content: string
  readonly defaultSender: string
  readonly id: number
  readonly name: string
  readonly type: 'text'

  constructor(data: API.ITextTemplate) {
    this.content = ensureNonEmptyString(data.content)
    this.defaultSender = ensurePhoneNumber(data.default_sender)
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
  }

  public toApiRepresentation(): API.ITextTemplate {
    return {
      content: this.content,
      default_sender: this.defaultSender,
      id: this.id,
      name: this.name
    }
  }
}
