import { sampleField } from '../../support/factories'

describe('Field', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => sampleField({ id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => sampleField({ id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(() => sampleField({ name: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleField({ name: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleField({ name: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures value is a non-empty string', () => {
      expect(() => sampleField({ value: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleField({ value: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleField({ value: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })
  })
})
