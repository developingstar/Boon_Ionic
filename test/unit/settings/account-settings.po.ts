import { AccountSettingsPage } from '../../../src/app/settings/account-settings/account-settings'
import { PageObject } from '../../support/page.po'

export class AccountSettingsPageObject extends PageObject<AccountSettingsPage> {
  get header(): string | undefined {
    return this.findByCss<HTMLElement>('h1')!.textContent || undefined
  }

  get userName(): string | undefined | null {
    return this.findDebugByCss('.user-name input')!.nativeElement.value
  }

  get buttonState(): any[] {
    return this.findAllByCss('.settings-button')
  }

  clickResetPasswordButton(): void {
    this.clickButton('Reset Password')
  }

  clickButton(name: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
