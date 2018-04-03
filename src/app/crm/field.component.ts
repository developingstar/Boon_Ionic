import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

export interface ISelectOption {
  readonly label: string
  readonly value: string
}

@Component({
  selector: 'field',
  templateUrl: 'field.component.html'
})
export class FieldComponent {
  @Input() public readonly type: 'input' | 'select'
  @Input() public readonly form: FormGroup
  @Input() public readonly formField: string
  @Input() public readonly label: string
  @Input() public readonly options: ReadonlyArray<ISelectOption>
}
