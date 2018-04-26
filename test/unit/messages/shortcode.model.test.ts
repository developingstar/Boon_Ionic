import { sampleShortcode } from '../../support/factories'

describe('Shortcode', () => {
  describe('constructor', () => {
    it('ensures name is a non-empty string', () => {
      expect(() => sampleShortcode({ name: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleShortcode({ name: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleShortcode({ name: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures shortcode is a non-empty string', () => {
      expect(() => sampleShortcode({ shortcode: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleShortcode({ shortcode: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleShortcode({ shortcode: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })
  })
})
