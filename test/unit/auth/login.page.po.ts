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

  private setInputByType(type: string, value: string): void {
    const input = this.findByCss<HTMLInputElement>(`input[type="${type}"]`)
    this.setInput(input!, value)
  }
}
