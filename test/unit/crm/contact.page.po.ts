import { ContactShowPage } from '../../../src/app/crm/contact-show.page'
import { PageObject } from '../../support/page.po'

export class ContactPageObject extends PageObject<ContactShowPage> {
  clickBackButton(): void {
    this.click(this.findDebugByCss('#back-button')!)
  }

  get contactName(): string | null {
    return this.findByCss<HTMLElement>('h1')!.textContent || null
  }

  get baseFieldValues(): string[] {
    return this.findAllByCss<HTMLDivElement>('div.display-value').map(
      (el) => el.textContent || ''
    )
  }

  setInputValue(name: string, value: string): void {
    this.setInputByName(name, value)
  }

  selectOwner(value: any): void {
    const element = this.findByCss<HTMLSelectElement>('select')!
    element.selectedValue = value.id
    this.setSelect(element, value)
  }

  getEditVales(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.boon-input')!
  }

  isButtonVisible(label: string): boolean {
    return this.elementVisible('button', label)
  }

  clickEditButton(): void {
    this.clickButton('Edit')
  }

  clickSaveButton(): void {
    this.clickButton('Save')
  }

  clickCancelButton(): void {
    this.clickButton('Cancel')
  }

  private clickButton(name: string): void {
    const button = this.findAllDebugByCss('.deal-buttons-section button').find(
      (de) => de.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
