import { FormControl } from '@angular/forms'

import { Pipeline } from '../crm/pipeline.model'

export type UserAction =
  | { readonly name: 'create' }
  | { readonly name: 'list' }
  | { readonly name: 'new' }
  | { readonly name: 'update' }
  | { readonly name: 'add-stage'; readonly stage: IStageState }
  | {
      readonly name: 'edit-stage'
      readonly stage: IStageState
      readonly newName: string
    }
  | { readonly name: 'edit'; readonly pipeline: Pipeline }

export interface IStageState {
  readonly edited: boolean
  readonly id: number | undefined
  readonly name: string
}

export type State =
  | { readonly mode: 'list'; readonly pipelines: ReadonlyArray<Pipeline> }
  | {
      readonly mode: 'edit'
      readonly nameInput: FormControl
      readonly pipeline: Pipeline
      readonly stages: ReadonlyArray<IStageState>
    }
  | {
      readonly mode: 'new'
      readonly nameInput: FormControl
      readonly stages: ReadonlyArray<IStageState>
    }

export const initialState: State = {
  mode: 'list',
  pipelines: []
}
