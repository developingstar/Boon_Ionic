import { DealsShowPage } from '../../../src/app/deals/deals-show.page'
import { PageObject } from '../../support/page.po'

export class DealsShowPageObject extends PageObject<DealsShowPage> {
  clickUpdateButton(): void {
    this.clickButton('.edit-button')
  }

  getViewValues(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.display-value')!
  }

  getEditVales(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.boon-input')!
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
