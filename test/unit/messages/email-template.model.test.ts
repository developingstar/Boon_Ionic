import { EmailTemplate } from '../../../src/app/messages/email-template.model'
import { sampleEmailTemplate } from '../../support/factories'

describe('EmailTemplate', () => {
  describe('constructor', () => {
    it('ensures content is a non-empty string', () => {
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ content: null }))
      ).toThrow(new Error('Expected null to be a non-empty string'))
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ content: '' }))
      ).toThrow(new Error('Expected  to be a non-empty string'))
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ content: 1 }))
      ).toThrow(new Error('Expected 1 to be a non-empty string'))
    })

    it('ensures default sender is an e-mail', () => {
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ default_sender: null }))
      ).toThrow(new Error('Expected null to be an e-mail'))
      expect(
        () =>
          new EmailTemplate(
            sampleEmailTemplate({ default_sender: 'userexample.com' })
          )
      ).toThrow(new Error('Expected userexample.com to be an e-mail'))
      expect(
        () =>
          new EmailTemplate(
            sampleEmailTemplate({ default_sender: '+999 600 100 200' })
          )
      ).toThrow(new Error('Expected +999 600 100 200 to be an e-mail'))
    })

    it('ensures id is a number', () => {
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ id: null }))
      ).toThrow(new Error('Expected null to be a number'))
      expect(() => new EmailTemplate(sampleEmailTemplate({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures name is a non-empty string', () => {
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ name: null }))
      ).toThrow(new Error('Expected null to be a non-empty string'))
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ name: '' }))
      ).toThrow(new Error('Expected  to be a non-empty string'))
      expect(() => new EmailTemplate(sampleEmailTemplate({ name: 1 }))).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures subject is a non-empty string', () => {
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ subject: null }))
      ).toThrow(new Error('Expected null to be a non-empty string'))
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ subject: '' }))
      ).toThrow(new Error('Expected  to be a non-empty string'))
      expect(
        () => new EmailTemplate(sampleEmailTemplate({ subject: 1 }))
      ).toThrow(new Error('Expected 1 to be a non-empty string'))
    })
  })

  describe('sender', () => {
    it('returns name and email', () => {
      const template = new EmailTemplate(
        sampleEmailTemplate({
          default_sender: 'john@example.com',
          default_sender_name: 'John Boon'
        })
      )

      expect(template.sender).toEqual('John Boon <john@example.com>')
    })

    describe('when name is missing', () => {
      it('returns email', () => {
        const template = new EmailTemplate(
          sampleEmailTemplate({
            default_sender: 'john@example.com',
            default_sender_name: null
          })
        )

        expect(template.sender).toEqual('john@example.com')
      })
    })
  })
})
