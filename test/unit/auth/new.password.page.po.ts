import { NewPasswordPage } from '../../../src/app/auth/new.password.page'
import { PageObject } from '../../support/page.po'

export class NewPasswordPageObject extends PageObject<NewPasswordPage> {
  setInputValue(name: string, value: string): void {
    const input = this.findByCss<HTMLInputElement>(`ion-input.${name} input`)
    expect(input).toBeTruthy()
    this.setInput(input!, value)
  }

  submitForm(): void {
    const form = this.findByCss<HTMLFontElement>('form')
    expect(form).toBeTruthy()
    form!.dispatchEvent(new Event('submit'))
  }

  get header(): string {
    const h1 = this.findByCss<HTMLHeadingElement>('h1')
    return h1 ? h1.textContent || '' : ''
  }

  get codeInputVisible(): boolean {
    const input = this.findByCss<HTMLInputElement>('ion-input.code input')
    expect(input).toBeTruthy()
    return input ? true : false
  }

  get newPasswordInputVisible(): boolean {
    const input = this.findByCss<HTMLInputElement>(
      'ion-input.new-password input'
    )
    expect(input).toBeTruthy()
    return input ? true : false
  }

  get confirmPasswordInputVisible(): boolean {
    const input = this.findByCss<HTMLInputElement>(
      'ion-input.confirm-password input'
    )
    expect(input).toBeTruthy()
    return input ? true : false
  }

  get loginHereVisible(): boolean {
    const element = this.findDebugByCss('a.login')
    return element ? true : false
  }

  clickLoginHere(): void {
    const link = this.findDebugByCss('a.login')
    expect(link).toBeTruthy()
    this.click(link!)
  }

  clickSubmitCodeButton(): void {
    this.clickButton('Submit Code')
  }

  get submitCodeButtonVisible(): boolean {
    return this.elementVisible('button', 'Submit Code')
  }

  get sendCodeButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Submit Code')
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
