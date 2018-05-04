import { ISelectOption } from './../journeys/modals/event-modal.helpers'

export const unitOptions: ReadonlyArray<ISelectOption> = [
  { label: 'Minute(s)', value: 60 },
  { label: 'Hour(s)', value: 60 * 60 },
  { label: 'Day(s)', value: 60 * 60 * 24 },
  { label: 'Week(s)', value: 60 * 60 * 24 * 7 }
]

export function secondsInOptimalUnit(
  seconds: number
): {
  readonly value: number
  readonly unit: string
  readonly factor: number
} {
  if (seconds < 3600 || seconds % 3600 !== 0) {
    return {
      factor: 60,
      unit: 'minute(s)',
      value: seconds / 60
    }
  } else if (seconds < 86400 || seconds % 86400 !== 0) {
    return {
      factor: 3600,
      unit: 'hour(s)',
      value: seconds / 3600
    }
  } else if (seconds < 604800 || seconds % 604800 !== 0) {
    return {
      factor: 86400,
      unit: 'day(s)',
      value: seconds / 86400
    }
  } else {
    return {
      factor: 604800,
      unit: 'week(s)',
      value: seconds / 604800
    }
  }
}
