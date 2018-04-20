import { FormControl } from '@angular/forms'

import {
  emailValidator,
  phoneNumberValidator
} from '../../../src/app/utils/form-validators'

function validate(validatorFactory: any, value: string): boolean {
  const validator = validatorFactory()
  const control = new FormControl(value)
  return validator(control) === null
}

describe('form validators', () => {
  describe('emailValidator', () => {
    it('requires the @ symbol', () => {
      expect(validate(emailValidator, 'a')).toBe(false)
      expect(validate(emailValidator, '@')).toBe(true)
    })
  })

  describe('phoneNumberValidator', () => {
    it('allows only numbers', () => {
      expect(validate(phoneNumberValidator, '1234')).toBe(true)
      expect(validate(phoneNumberValidator, '1 234')).toBe(false)
    })

    it('allows + prefix', () => {
      expect(validate(phoneNumberValidator, '+123')).toBe(true)
      expect(validate(phoneNumberValidator, '123+')).toBe(false)
    })
  })
})
