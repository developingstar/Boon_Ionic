import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { samplePipeline } from '../../support/factories'

describe('Pipeline', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => new Pipeline(samplePipeline({ id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new Pipeline(samplePipeline({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })
    it('ensures name is a non-empty string', () => {
      expect(() => new Pipeline(samplePipeline({ name: null }))).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => new Pipeline(samplePipeline({ name: '' }))).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => new Pipeline(samplePipeline({ name: 1 }))).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })
    it('ensures stage_order is an array of numbers', () => {
      expect(() => new Pipeline(samplePipeline({ stage_order: null }))).toThrow(
        new Error('Expected null to be an array of number elements')
      )
      expect(() => new Pipeline(samplePipeline({ stage_order: [''] }))).toThrow(
        new Error('Expected  to be an array of number elements')
      )
      expect(
        () => new Pipeline(samplePipeline({ stage_order: [null] }))
      ).toThrow(new Error('Expected  to be an array of number elements'))
    })
  })
})
