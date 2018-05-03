import { Lead } from '../../../src/app/crm/lead.model'
import { sampleLead } from '../../support/factories'

describe('Lead', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => new Lead(sampleLead({ id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new Lead(sampleLead({ id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures phone number is a non-empty string', () => {
      const nullPhonelead = new Lead(sampleLead({ phone_number: null }))
      const emptyPhoneLead = new Lead(sampleLead({ phone_number: '' }))
      expect(nullPhonelead.phoneNumber).toBeNull()
      expect(emptyPhoneLead.phoneNumber).toEqual('')
    })

    it('ensures stage_id is a number', () => {
      expect(() => new Lead(sampleLead({ stage_id: null }))).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => new Lead(sampleLead({ stage_id: '1' }))).toThrow(
        new Error('Expected 1 to be a number')
      )
    })
  })

  describe('name', () => {
    describe('when the first name and the last name are set', () => {
      it('returns concatenated values', () => {
        const lead: Lead = new Lead(
          sampleLead({
            firstName: 'John',
            lastName: 'Boon'
          })
        )

        expect(lead.name).toEqual('John Boon')
      })
    })

    describe('when the first name is set but the last name is missing', () => {
      it('returns value', () => {
        const lead: Lead = new Lead(
          sampleLead({
            firstName: 'John',
            lastName: null
          })
        )

        expect(lead.name).toEqual('John')
      })
    })

    describe('when the first name is missing but the last name is set', () => {
      it('returns value', () => {
        const lead: Lead = new Lead(
          sampleLead({
            firstName: null,
            lastName: 'Boon'
          })
        )

        expect(lead.name).toEqual('Boon')
      })
    })

    describe('when the first name and the last name are missing', () => {
      it('returns value', () => {
        const lead: Lead = new Lead(
          sampleLead({
            firstName: null,
            lastName: null
          })
        )

        expect(lead.name).toBeUndefined()
      })
    })
  })
})
