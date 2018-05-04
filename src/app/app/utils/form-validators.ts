import { ValidatorFn, Validators } from '@angular/forms'

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
