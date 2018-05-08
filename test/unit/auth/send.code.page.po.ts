import { SendCodePage } from '../../../src/app/auth/send.code.page'
import { PageObject } from '../../support/page.po'

export class SendCodePageObject extends PageObject<SendCodePage> {
  setEmail(value: string): void {
    const input = this.findByCss<HTMLInputElement>(`input[type="email"]`)
    expect(input).toBeTruthy()
    this.setInput(input!, value)
  }

  submitForm(): void {
    const form = this.findByCss<HTMLFontElement>('form')
    expect(form).toBeTruthy()
    form!.dispatchEvent(new Event('submit'))
  }

  clickSendCodeButton(): void {
    this.clickButton('Send Code')
  }

  get header(): string {
    const h1 = this.findByCss<HTMLHeadingElement>('h1')
    return h1 ? h1.textContent || '' : ''
  }

  get emailInputVisible(): boolean {
    const input = this.findByCss<HTMLInputElement>(`input[type="email"]`)
    expect(input).toBeTruthy()
    return input ? true : false
  }

  get sendCodeButtonVisible(): boolean {
    return this.elementVisible('button', 'Send Code')
  }

  get sendCodeButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Send Code')
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

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
