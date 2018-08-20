import { Deal } from '../../../src/app/deals/deal.model'
import { sampleDeal } from '../../support/factories'

describe('Deal', () => {
  describe('constructor', () => {
    it('ensures a deal has correct number of attributes', () => {
      const apiDeal = sampleDeal()
      const modelDeal = new Deal(apiDeal)
      expect(Object.keys(modelDeal).length).toBe(10)
    })
  })
})
