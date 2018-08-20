import { DealsIndexPage } from '../../../src/app/deals/deals-index.page'
import { PageObject } from '../../support/page.po'

export class DealsIndexPageObject extends PageObject<DealsIndexPage> {
  dealsTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  clickPrevPageButton(): void {
    this.clickButton('.deal-end button:first-of-type')
  }

  clickNextPageButton(): void {
    this.clickButton('.deal-end button:last-of-type')
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
