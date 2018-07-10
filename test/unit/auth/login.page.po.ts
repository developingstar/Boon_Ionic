import { LoginPage } from '../../../src/app/auth/login.page'
import { PageObject } from '../../support/page.po'

export class LoginPageObject extends PageObject<LoginPage> {
  setEmail(value: string): void {
    this.setInputByType('email', value)
  }

  setPassword(value: string): void {
    this.setInputByType('password', value)
  }

  submitForm(): void {
    const form = this.findByCss<HTMLFontElement>('form')
    form!.dispatchEvent(new Event('submit'))
  }

  clickForgotPassword(): void {
    this.clickButton('Forgot')
  }

  get forgotButtonVisible(): boolean {
    return this.elementVisible('button', 'Forgot')
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }

  private setInputByType(type: string, value: string): void {
    const input = this.findByCss<HTMLInputElement>(`input[type="${type}"]`)
    this.setInput(input!, value)
  }
}
