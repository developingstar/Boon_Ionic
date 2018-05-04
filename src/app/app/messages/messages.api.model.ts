export interface ITextTemplate {
  readonly content: string
  readonly default_sender: string
  readonly id?: number
  readonly name: string
}

export interface ITextTemplateCreateRequest {
  readonly template: {
    readonly content: string
    readonly name: string
    readonly default_sender: string
  }
}

export interface ITextTemplateUpdateRequest {
  readonly template: {
    readonly content?: string
    readonly name?: string
    readonly default_sender?: string
  }
}

export interface ITextTemplateResponse {
  readonly data: {
    readonly template: ITextTemplate
  }
}

export interface ITextTemplatesResponse {
  readonly data: {
    readonly templates: ReadonlyArray<ITextTemplate>
  }
}

export interface IEmailTemplate {
  readonly content: string
  readonly default_sender: string
  readonly default_sender_name: string | null
  readonly id?: number
  readonly name: string
  readonly subject: string
}

export interface IEmailTemplateCreateRequest {
  readonly template: {
    readonly content: string
    readonly default_sender: string
    readonly default_sender_name?: string
    readonly name: string
    readonly subject: string
  }
}

export interface IEmailTemplateUpdateRequest {
  readonly template: {
    readonly content?: string
    readonly default_sender?: string
    readonly default_sender_name?: string
    readonly name?: string
    readonly subject?: string
  }
}

export interface IEmailTemplateResponse {
  readonly data: {
    readonly template: IEmailTemplate
  }
}

export interface IEmailTemplatesResponse {
  readonly data: {
    readonly templates: ReadonlyArray<IEmailTemplate>
  }
}

export interface IShortcode {
  readonly name: string
  readonly shortcode: string
}

export interface IShortcodesResponse {
  readonly data: {
    readonly shortcodes: ReadonlyArray<IShortcode>
  }
}
