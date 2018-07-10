import { AddEditTeamMemberPage } from '../../../src/app/settings/team-members/add-edit-team-member.page'
import { PageObject } from '../../support/page.po'

export class AddTeamMembersPageObject extends PageObject<
  AddEditTeamMemberPage
> {
  get header(): string | undefined {
    return this.findByCss<HTMLElement>('h1')!.textContent || undefined
  }

  get userName(): string | undefined | null {
    return this.findDebugByCss('.user-name input')!.nativeElement.value
  }

  get buttonText(): any[] {
    return this.findAllByCss('.settings-button .button-inner')
  }

  get buttonState(): any[] {
    return this.findAllByCss('.settings-button')
  }

  get value(): string {
    return this.findByCss<HTMLInputElement>('input')!.value
  }

  setUserName(name: string): void {
    const element = this.findByCss<HTMLInputElement>('.user-name input')
    expect(element).toBeTruthy()
    this.setInput(element!, name)
  }

  setUserEmail(email: string): void {
    const element = this.findByCss<HTMLInputElement>('.email input')
    expect(element).toBeTruthy()
    this.setInput(element!, email)
  }

  clickUpdateTeamMemberButton(): void {
    this.clickButton('update team member')
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
