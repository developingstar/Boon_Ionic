import { JourneysPage } from '../../../src/app/journeys/journeys.page'
import { PageObject } from '../../support/page.po'

export class JourneysPageObject extends PageObject<JourneysPage> {
  journeysTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  clickPrevPageButton(): void {
    this.clickButton('.footer button:first-of-type')
  }

  clickNextPageButton(): void {
    this.clickButton('.footer button:last-of-type')
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
