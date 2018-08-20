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
}
