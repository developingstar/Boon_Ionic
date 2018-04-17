import { CustomFieldsPage } from '../../../src/app/settings/custom-fields.page'
import { PageObject } from '../../support/page.po'

export class CustomFieldsPageObject extends PageObject<CustomFieldsPage> {
  get header(): string {
    const h = this.findByCss<HTMLHeadingElement>('h2')
    return h ? h.textContent || '' : ''
  }

  get customFields(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('button.button-with-arrow').map(
      (el) => el.textContent || ''
    )
  }

  get addFieldButtonVisible(): boolean {
    return this.buttonVisible('Add New Field')
  }

  clickAddFieldButton(): void {
    this.clickButton('Add New Field')
  }

  get createFieldButtonVisible(): boolean {
    return this.buttonVisible('Create Field')
  }

  get createFieldButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Create Field')
  }

  clickCreateFieldButton(): void {
    this.clickButton('Create Field')
  }

  clickCustomField(name: string): void {
    const button = this.findAllDebugByCss('.button-with-arrow').find(
      (b) => b.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }

  get updateFieldButtonVisible(): boolean {
    return this.buttonVisible('Update Field')
  }

  get updateFieldButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Update Field')
  }

  clickUpdateFieldButton(): void {
    this.clickButton('Update Field')
  }

  buttonVisible(name: string): boolean {
    return this.elementVisible('button', name)
  }

  clickBack(): void {
    const link = this.findDebugByCss('a.back-link')
    expect(link).toBeTruthy()
    this.click(link!)
  }

  clickButton(name: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }

  setName(name: string): void {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    expect(element).toBeTruthy()
    this.setInput(element!, name)
  }
}
