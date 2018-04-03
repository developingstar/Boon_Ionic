export function ensureNonEmptyString(data: any): string {
  if (typeof data === 'string' && data.length > 0) {
    return data
  } else {
    throw new Error(`Expected ${data} to be a non-empty string`)
  }
}

export function ensureNumber(data: any): number {
  if (typeof data === 'number') {
    return data
  } else {
    throw new Error(`Expected ${data} to be a number`)
  }
}

export function ensureInclusionOf<T>(
  data: T,
  possibleValues: ReadonlyArray<T>
): T {
  if (
    possibleValues.find((possibleValue) => possibleValue === data) === undefined
  ) {
    throw new Error(`Expected ${data} to be one of ${possibleValues}`)
  } else {
    return data
  }
}

export function ensureArrayOf<T>(data: any, type: string): ReadonlyArray<T> {
  if (data instanceof Array && findByTypeMismatch(data, type) === undefined) {
    return data
  } else {
    throw new Error(`Expected ${data} to be an array of ${type} elements`)
  }
}

function findByTypeMismatch<T>(
  array: ReadonlyArray<T>,
  type: string
): T | undefined {
  return array.find((item) => typeof item !== type)
}
