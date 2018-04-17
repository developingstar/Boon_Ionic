import { secondsInOptimalUnit } from '../../../src/app/journeys/duration.helpers'

describe('duration helpers', () => {
  describe('secondsInOptimalUnit', () => {
    it('works for minutes', () => {
      expect(secondsInOptimalUnit(600)).toEqual({
        factor: 60,
        unit: 'minute(s)',
        value: 10
      })

      expect(secondsInOptimalUnit(1260)).toEqual({
        factor: 60,
        unit: 'minute(s)',
        value: 21
      })
    })

    it('works for hours', () => {
      expect(secondsInOptimalUnit(3600)).toEqual({
        factor: 3600,
        unit: 'hour(s)',
        value: 1
      })

      expect(secondsInOptimalUnit(75600)).toEqual({
        factor: 3600,
        unit: 'hour(s)',
        value: 21
      })
    })

    it('works for days', () => {
      expect(secondsInOptimalUnit(86400)).toEqual({
        factor: 86400,
        unit: 'day(s)',
        value: 1
      })

      expect(secondsInOptimalUnit(432000)).toEqual({
        factor: 86400,
        unit: 'day(s)',
        value: 5
      })
    })

    it('works for weeks', () => {
      expect(secondsInOptimalUnit(604800)).toEqual({
        factor: 604800,
        unit: 'week(s)',
        value: 1
      })

      expect(secondsInOptimalUnit(3024000)).toEqual({
        factor: 604800,
        unit: 'week(s)',
        value: 5
      })

      expect(secondsInOptimalUnit(30240000)).toEqual({
        factor: 604800,
        unit: 'week(s)',
        value: 50
      })
    })

    it('returns minutes when cannot divide by hour', () => {
      expect(secondsInOptimalUnit(3660)).toEqual({
        factor: 60,
        unit: 'minute(s)',
        value: 61
      })

      expect(secondsInOptimalUnit(75720)).toEqual({
        factor: 60,
        unit: 'minute(s)',
        value: 1262
      })
    })

    it('returns hours when cannot divide by day', () => {
      expect(secondsInOptimalUnit(90000)).toEqual({
        factor: 3600,
        unit: 'hour(s)',
        value: 25
      })

      expect(secondsInOptimalUnit(435600)).toEqual({
        factor: 3600,
        unit: 'hour(s)',
        value: 121
      })
    })

    it('returns days when cannot divide by week', () => {
      expect(secondsInOptimalUnit(691200)).toEqual({
        factor: 86400,
        unit: 'day(s)',
        value: 8
      })

      expect(secondsInOptimalUnit(1900800)).toEqual({
        factor: 86400,
        unit: 'day(s)',
        value: 22
      })
    })
  })
})
