export function assertTableRow(
  element: Element,
  expectedValues: ReadonlyArray<string>
): void {
  const columns = element.querySelectorAll('.col')

  for (let index = 0; index < columns.length; index++) {
    const actualValue = columns.item(index).textContent
    const expectedValue = expectedValues[index]

    expect(actualValue).toEqual(expectedValue)
  }
}
