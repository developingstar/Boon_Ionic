import { ensureNonEmptyString, ensureNumber } from '../utils/validators'

export class Stage {
  readonly id: number
  readonly name: string
  readonly pipeline_id: number

  constructor(data: Crm.API.IStage) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.pipeline_id = ensureNumber(data.pipeline_id)
  }
}
