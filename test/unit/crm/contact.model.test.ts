import { Contact } from '../../../src/app/crm/contact.model'
import { sampleContact } from '../../support/factories'

describe('Contact', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => new Contact(sampleContact({ id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new Contact(sampleContact({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures phone number is a non-empty string', () => {
      const nullPhonecontact = new Contact(
        sampleContact({ phone_number: null })
      )
      const emptyPhoneContact = new Contact(sampleContact({ phone_number: '' }))
      expect(nullPhonecontact.phoneNumber).toBeNull()
      expect(emptyPhoneContact.phoneNumber).toEqual('')
    })

    it('ensures stage_id is a number', () => {
      expect(() => new Contact(sampleContact({ stage_id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new Contact(sampleContact({ stage_id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })
  })

  describe('name', () => {
    describe('when the first name and the last name are set', () => {
      it('returns concatenated values', () => {
        const contact: Contact = new Contact(
          sampleContact({
            first_name: 'John',
            last_name: 'Boon'
          })
        )

        expect(contact.name).toEqual('John Boon')
      })
    })

    describe('when the first name is set but the last name is missing', () => {
      it('returns value', () => {
        const contact: Contact = new Contact(
          sampleContact({
            first_name: 'John',
            last_name: undefined
          })
        )

        expect(contact.name).toEqual('John')
      })
    })

    describe('when the first name is missing but the last name is set', () => {
      it('returns value', () => {
        const contact: Contact = new Contact(
          sampleContact({
            first_name: undefined,
            last_name: 'Boon'
          })
        )

        expect(contact.name).toEqual('Boon')
      })
    })

    describe('when the first name and the last name are missing', () => {
      it('returns value', () => {
        const contact: Contact = new Contact(
          sampleContact({
            first_name: undefined,
            last_name: undefined
          })
        )

        expect(contact.name).toBeUndefined()
      })
    })
  })
})
