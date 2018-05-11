import { FormControl, Validators } from '@angular/forms'
import { numberValidator } from '../../utils/form-validators'

export interface ISelectOption {
  readonly label: string
  readonly value: number | null
}

export function numberFormControl(value: number | ''): FormControl {
  return new FormControl(value, [Validators.required, numberValidator()])
}

export function toSelectOption(
  objects: ReadonlyArray<{ readonly id: number; readonly name: string }>
): ReadonlyArray<ISelectOption> {
  const options = objects.map((object) => {
    return {
      label: object.name,
      value: object.id
    }
  })

  const defaultOption: ISelectOption = { label: '', value: null }

  return [defaultOption].concat(options)
}

export function buildSelectOptions(
  objects: ReadonlyArray<{ readonly id: number; readonly name: string }>
): ReadonlyArray<ISelectOption> {
  const options = objects.map((object) => {
    return {
      label: object.name,
      value: object.id
    }
  })
  return options
}
