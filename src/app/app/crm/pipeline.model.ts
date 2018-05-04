import {
  ensureArrayOf,
  ensureNonEmptyString,
  ensureNumber
} from '../utils/validators'

export class Pipeline {
  readonly id: number
  readonly name: string
  readonly stageOrder: ReadonlyArray<number>

  constructor(data: Crm.API.IPipeline) {
    this.id = ensureNumber(data.id)
    this.name = ensureNonEmptyString(data.name)
    this.stageOrder = ensureArrayOf(data.stage_order, 'number')
  }
}
