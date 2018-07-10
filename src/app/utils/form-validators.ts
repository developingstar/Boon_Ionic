import { FormControl, ValidatorFn, Validators } from '@angular/forms'

export const emailRegExp = /@/
export const numberRegExp = /^\d+$/
export const phoneNumberRegExp = /^\+?\d+$/

export function emailValidator(): ValidatorFn {
  return Validators.pattern(emailRegExp)
}

export function numberValidator(): ValidatorFn {
  return Validators.pattern(numberRegExp)
}

export function phoneNumberValidator(): ValidatorFn {
  return Validators.pattern(phoneNumberRegExp)
}

export function matchOtherValidator(otherControlName: string): any {
  let thisControl: FormControl
  let otherControl: FormControl

  return function matchOtherValidate(control: FormControl): any {
    if (!control.parent) {
      return null
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control
      otherControl = control.parent.get(otherControlName) as FormControl
      if (!otherControl) {
        throw new Error(
          'matchOtherValidator(): other control is not found in parent group'
        )
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity()
      })
    }

    if (!otherControl) {
      return null
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      }
    }

    return null
  }
}
