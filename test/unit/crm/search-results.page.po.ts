import { SearchResultsPage } from '../../../src/app/crm/search-results.page'
import { PageObject } from '../../support/page.po'

export class SearchResultsPageObject extends PageObject<SearchResultsPage> {
  isButtonVisible(label: string): boolean {
    return this.elementVisible('button', label)
  }

  hasClass(label: string, className: string): boolean {
    const button: HTMLInputElement | null = this.findByCss(className)
    expect(button).toBeTruthy()
    return button && button.innerText === label ? true : false
  }

  clickPrevPageButton(): void {
    this.clickButton('.action button:first-of-type')
  }

  clickNextPageButton(): void {
    this.clickButton('.action button:last-of-type')
  }

  clickActionButton(text: string): void {
    this.clickButtonByText(text)
  }

  resultsTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }

  private clickButtonByText(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
