import { Lead } from '../../../src/app/crm/lead.model'
import { sampleLead } from '../../support/factories'

describe('Lead', () => {
  describe('constructor', () => {
    it('ensures id is a number', () => {
      expect(() => sampleLead({ id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => sampleLead({ id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures phone number is a non-empty string', () => {
      expect(() => sampleLead({ phone_number: null })).toThrow(
        new Error('Expected null to be a non-empty string')
      )
      expect(() => sampleLead({ phone_number: '' })).toThrow(
        new Error('Expected  to be a non-empty string')
      )
      expect(() => sampleLead({ phone_number: 1 })).toThrow(
        new Error('Expected 1 to be a non-empty string')
      )
    })

    it('ensures stage_id is a number', () => {
      expect(() => sampleLead({ stage_id: null })).toThrow(
        new Error('Expected null to be a number')
      )
      expect(() => sampleLead({ stage_id: '1' })).toThrow(
        new Error('Expected 1 to be a number')
      )
    })

    it('ensures valid fields', () => {
      expect(() =>
        sampleLead({ fields: [{ id: 1, name: 'First Name' }] })
      ).toThrow(new Error('Expected undefined to be a non-empty string'))
    })
  })

  describe('name', () => {
    describe('when the first name and the last name are set', () => {
      it('returns concatenated values', () => {
        const lead: Lead = sampleLead({
          firstName: 'John',
          lastName: 'Boon'
        })

        expect(lead.name).toEqual('John Boon')
      })
    })

    describe('when the first name is set but the last name is missing', () => {
      it('returns value', () => {
        const lead: Lead = sampleLead({
          firstName: 'John',
          lastName: null
        })

        expect(lead.name).toEqual('John')
      })
    })

    describe('when the first name is missing but the last name is set', () => {
      it('returns value', () => {
        const lead: Lead = sampleLead({
          firstName: null,
          lastName: 'Boon'
        })

        expect(lead.name).toEqual('Boon')
      })
    })

    describe('when the first name and the last name are missing', () => {
      it('returns value', () => {
        const lead: Lead = sampleLead({
          firstName: null,
          lastName: null
        })

        expect(lead.name).toBeUndefined()
      })
    })
  })
})
