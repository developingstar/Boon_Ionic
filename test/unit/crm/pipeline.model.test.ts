import { samplePipeline } from '../../support/factories'

describe('Pipeline', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => samplePipeline({ id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => samplePipeline({ id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(() => samplePipeline({ name: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => samplePipeline({ name: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => samplePipeline({ name: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures stage_order is an array of numbers', () => {
      expect(() => samplePipeline({ stage_order: null })).toThrow(
        new Error('Expected null to be an array of number elements')
      )
      expect(() => samplePipeline({ stage_order: [''] })).toThrow(
        new Error('Expected  to be an array of number elements')
      )
      expect(() => samplePipeline({ stage_order: [null] })).toThrow(
        new Error('Expected  to be an array of number elements')
      )
    })
  })
})
