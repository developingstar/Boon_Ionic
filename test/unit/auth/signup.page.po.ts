import { DebugElement } from '@angular/core'

import { SignupPage } from '../../../src/app/auth/signup.page'
import { PageObject } from '../../support/page.po'

export class SignupPageObject extends PageObject<SignupPage> {
  setOrganization(value: string): void {
    this.setInputByName('organization', value)
  }
  setName(value: string): void {
    this.setInputByName('name', value)
  }
  setEmail(value: string): void {
    this.setInputByName('email', value)
  }
  setPhone(value: string): void {
    this.setInputByName('phone', value)
  }
  setPassword(value: string): void {
    this.setInputByName('password', value)
  }
  setConfirm(value: string): void {
    this.setInputByName('confirm', value)
  }

  clickSignupButton(): void {
    this.clickButton('SignUp')
  }

  get isSignupButtonEnabled(): boolean {
    return !this.getButton('SignUp').nativeElement.disabled
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }

  private getButton(label: string): DebugElement {
    const button = this.findAllDebugByCss('button').find(
      (de) => de.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    return button!
  }
}
