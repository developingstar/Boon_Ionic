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

  leadsTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  showingFrom(): HTMLElement {
    return this.findByCss<HTMLElement>('.showing-from')!
  }

  showingTo(): HTMLElement {
    return this.findByCss<HTMLElement>('.showing-to')!
  }

  showingTotal(): HTMLElement {
    return this.findByCss<HTMLElement>('.showing-total')!
  }

  clickNewContactButton(): void {
    this.clickButton('button.new-contact')
  }

  selectPipeline(position: number): void {
    const selector = `.nav-pipelines ion-row ion-col:nth-child(${position}) span`
    const item = this.findDebugByCss(selector)
    this.click(item!)
    this.fixture.detectChanges()
  }

  selectStage(position: number): void {
    const selector = `.nav-stages .item-container:nth-child(${position})`
    const item = this.findDebugByCss(selector)
    this.click(item!)
    this.fixture.detectChanges()
  }

  getHeader(): string {
    const h2 = this.findByCss<HTMLHeadingElement>('h2')
    return h2 ? h2.textContent || '' : ''
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
