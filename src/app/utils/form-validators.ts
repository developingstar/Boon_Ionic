import { ValidatorFn, Validators } from '@angular/forms'

const emailRegExp = /@/
const phoneNumberRegExp = /^\+?\d+$/

export function emailValidator(): ValidatorFn {
  return Validators.pattern(emailRegExp)
}

export function phoneNumberValidator(): ValidatorFn {
  return Validators.pattern(phoneNumberRegExp)
}
