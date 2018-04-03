import { sampleFieldDefinition } from '../../support/factories'

describe('FieldDefinition', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => sampleFieldDefinition({ id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => sampleFieldDefinition({ id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(() => sampleFieldDefinition({ name: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleFieldDefinition({ name: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleFieldDefinition({ name: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })
  })
})
