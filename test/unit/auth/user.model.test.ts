import { sampleUser } from '../../support/factories'

describe('Field', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => sampleUser({ id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => sampleUser({ id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures email is a non-empty string', () => {
      expect(() => sampleUser({ email: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleUser({ email: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleUser({ email: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(() => sampleUser({ name: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleUser({ name: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleUser({ name: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures valid role', () => {
      expect(() => sampleUser({ role: null })).toThrow(
        new Error('Expected null to be one of admin,lead_owner')
      )
      expect(() => sampleUser({ role: 'guest' })).toThrow(
        new Error('Expected guest to be one of admin,lead_owner')
      )
    })
  })
})
