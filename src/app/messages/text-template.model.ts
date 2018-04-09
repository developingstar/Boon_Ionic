import {
  ensureNonEmptyString,
  ensureNumber,
  ensurePhoneNumber
} from '../utils/validators'
import * as API from './messages.api.model'

export class TextTemplate {
  readonly content: string
  readonly default_sender: string
  readonly id: number
  readonly name: string
  readonly type: 'text'

  constructor(data: API.ITextTemplate) {
    this.content = ensureNonEmptyString(data.content)
    this.default_sender = ensurePhoneNumber(data.default_sender)
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
  }
}
