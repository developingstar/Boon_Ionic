import { IntegrationPage } from '../../../src/app/settings/integration.page'
import { PageObject } from '../../support/page.po'

export class IntegrationPageObject extends PageObject<IntegrationPage> {
  get createServiceButtonVisible(): boolean {
    return this.elementVisible('button', 'Create Token')
  }

  get updateServiceButtonVisible(): boolean {
    return this.elementVisible('button', 'Update Token')
  }

  get createServiceButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Create Token')
  }

  get updateServiceButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Update Token')
  }

  clickActionButton(text: string): void {
    this.clickButton(text)
  }

  get header(): string {
    const h2 = this.findByCss<HTMLHeadingElement>('h2')
    return h2 ? h2.textContent || '' : ''
  }

  get token(): string {
    const token = this.findByCss<HTMLInputElement>('ion-input input')
    return token ? token.value || '' : ''
  }

  setToken(token: string): void {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    expect(element).toBeTruthy()
    this.setInput(element!, token)
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
