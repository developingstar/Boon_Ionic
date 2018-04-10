import * as API from './templates.api.model'

export class Template {
  readonly id: number
  readonly type: string
  readonly subject: string
  readonly name: string
  readonly default_sender_name: string
  readonly default_sender: string
  readonly content: string

  constructor(data: API.ITemplate) {
    this.id = data.id
    this.type = data.type
    this.subject = data.subject
    this.name = data.name
    this.default_sender_name = data.default_sender_name
    this.default_sender = data.default_sender
    this.content = data.content
  }
}
