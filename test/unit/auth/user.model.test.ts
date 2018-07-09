import { User } from '../../../src/app/auth/user.model'
import { sampleUser } from '../../support/factories'

describe('Field', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => new User(sampleUser({ id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new User(sampleUser({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures email is a non-empty string', () => {
      expect(() => new User(sampleUser({ email: null }))).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => new User(sampleUser({ email: '' }))).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => new User(sampleUser({ email: 1 }))).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(() => new User(sampleUser({ name: null }))).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => new User(sampleUser({ name: '' }))).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => new User(sampleUser({ name: 1 }))).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures valid role', () => {
      expect(() => new User(sampleUser({ role: null }))).toThrow(
        new Error('Expected null to be one of admin,sales_rep')
      )
      expect(() => new User(sampleUser({ role: 'guest' }))).toThrow(
        new Error('Expected guest to be one of admin,sales_rep')
      )
    })
  })
})
