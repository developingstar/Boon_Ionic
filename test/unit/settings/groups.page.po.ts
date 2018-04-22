import { GroupsPage } from '../../../src/app/settings/groups.page'
import { PageObject } from '../../support/page.po'

export class GroupsPageObject extends PageObject<GroupsPage> {
  get createGroupButtonVisible(): boolean {
    return this.elementVisible('button', 'Create Group')
  }

  get createGroupButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Create Group')
  }

  clickCreateGroupButton(): void {
    this.clickButton('Create Group')
  }

  get groupNameInputVisible(): boolean {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    return element ? true : false
  }

  clickBack(): void {
    const link = this.findDebugByCss('a.back-link')
    expect(link).toBeTruthy()
    this.click(link!)
  }

  clickPipeline(name: string): void {
    const button = this.findAllDebugByCss('.button-with-arrow').find(
      (b) => b.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }

  clickSavePipelineButton(): void {
    this.clickButton('Save Pipeline')
  }

  get header(): string {
    const h2 = this.findByCss<HTMLHeadingElement>('h2')
    return h2 ? h2.textContent || '' : ''
  }

  get groups(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('div.group-title').map(
      (el) => el.textContent || ''
    )
  }

  setName(name: string): void {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    expect(element).toBeTruthy()
    this.setInput(element!, name)
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
