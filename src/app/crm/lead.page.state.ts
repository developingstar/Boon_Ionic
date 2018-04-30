import { FormGroup } from '@angular/forms'

import { Lead } from '../crm/lead.model'
import { FieldDefinition } from './field-definition.model'
import { Stage } from './stage.model'

export type UserAction =
  | 'init'
  | 'show'
  | 'edit'
  | { readonly leadUpdate: Crm.API.ILeadUpdate; readonly name: 'update' }

export interface IPageData {
  readonly fields: ReadonlyArray<FieldDefinition>
  readonly lead: Lead
  readonly role: 'admin' | 'lead_owner' | undefined
  readonly stages: ReadonlyArray<Stage>
}

export type State =
  | { readonly mode: 'init' }
  | {
      readonly data: IPageData
      readonly formGroup: FormGroup
      readonly mode: 'show'
    }
  | {
      readonly data: IPageData
      readonly formGroup: FormGroup
      readonly mode: 'edit'
    }

export const initialState: State = {
  mode: 'init'
}
