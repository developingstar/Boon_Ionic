export interface ITextTemplate {
  readonly content: string
  readonly default_sender: string
  readonly id: number
  readonly name: string
}

export interface IEmailTemplate {
  readonly content: string
  readonly default_sender: string
  readonly default_sender_name: string | null
  readonly id: number
  readonly name: string
  readonly subject: string
}
