import { TextTemplate } from '../../../src/app/messages/text-template.model'
import { sampleTextTemplate } from '../../support/factories'

describe('TextTemplate', () => {
  describe('constructor', () => {
    it('ensures content is a non-empty string', () => {
      expect(
        () => new TextTemplate(sampleTextTemplate({ content: null }))
      ).toThrow(new Error('Expected null to be a non-empty string'))
      expect(
        () => new TextTemplate(sampleTextTemplate({ content: '' }))
      ).toThrow(new Error('Expected  to be a non-empty string'))
      expect(
        () => new TextTemplate(sampleTextTemplate({ content: 1 }))
      ).toThrow(new Error('Expected 1 to be a non-empty string'))
    })

    it('ensures default sender is a phone number', () => {
      expect(
        () => new TextTemplate(sampleTextTemplate({ default_sender: null }))
      ).toThrow(new Error('Expected null to be a phone number'))
      expect(
        () =>
          new TextTemplate(
            sampleTextTemplate({ default_sender: 'user@example.com' })
          )
      ).toThrow(new Error('Expected user@example.com to be a phone number'))
      expect(
        () =>
          new TextTemplate(
            sampleTextTemplate({ default_sender: '+999 600 100 200' })
          )
      ).toThrow(new Error('Expected +999 600 100 200 to be a phone number'))
    })

    it('ensures id is a number', () => {
      expect(() => new TextTemplate(sampleTextTemplate({ id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new TextTemplate(sampleTextTemplate({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(
        () => new TextTemplate(sampleTextTemplate({ name: null }))
      ).toThrow(new Error('Expected null to be a non-empty string'))
      expect(() => new TextTemplate(sampleTextTemplate({ name: '' }))).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => new TextTemplate(sampleTextTemplate({ name: 1 }))).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })
  })
})
