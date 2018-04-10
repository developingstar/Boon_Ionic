export interface ITemplatesResponse {
  readonly data: ITemplatesData
}

export interface ITemplateResponse {
  readonly data: ITemplateData
}

interface ITemplatesData {
  readonly templates: ReadonlyArray<ITemplate>
}

interface ITemplateData {
  readonly template: ITemplate
}

export interface ITemplate {
  readonly id: number
  readonly type: string
  readonly subject: string
  readonly name: string
  readonly default_sender_name: string
  readonly default_sender: string
  readonly content: string
}
