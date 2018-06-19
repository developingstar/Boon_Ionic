import { JourneysPage } from '../../../src/app/journeys/journeys.page'
import { PageObject } from '../../support/page.po'

export class JourneysPageObject extends PageObject<JourneysPage> {
  isButtonVisible(label: string): boolean {
    return this.elementVisible('button', label)
  }

  hasClass(label: string, className: string): boolean {
    const button: HTMLInputElement | null = this.findByCss(className)
    expect(button).toBeTruthy()
    return button && button.innerText === label ? true : false
  }

  clickActionButton(text: string): void {
    this.clickButtonByText(text)
  }

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

  private clickButtonByText(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
