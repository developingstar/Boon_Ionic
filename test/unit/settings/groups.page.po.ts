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

  get updateGroupButtonVisible(): boolean {
    return this.elementVisible('button', 'Update Group')
  }

  get updateGroupButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Update Group')
  }

  clickUpdateGroupButton(): void {
    this.clickButton('Update Group')
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

  clickGroup(name: string): void {
    const group = this.findAllDebugByCss('div.group-title').find(
      (b) => b.nativeElement.textContent === name
    )!
    expect(group).toBeTruthy()
    const parent = group.parent!.parent!
    expect(parent).toBeTruthy()
    this.click(parent!)
  }

  get header(): string {
    const h2 = this.findByCss<HTMLHeadingElement>('h2')
    return h2 ? h2.textContent || '' : ''
  }

  get groups(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLDivElement>('div.group-title').map(
      (el) => el.textContent || ''
    )
  }

  get groupUsers(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('span.user-name').map(
      (el) => el.textContent || ''
    )
  }

  get users(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('option').map(
      (el) => el.textContent || ''
    )
  }

  setGroupName(name: string): void {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    expect(element).toBeTruthy()
    this.setInput(element!, name)
  }

  deleteEvent(position: number): void {
    const element = this.findDebugByCss(
      `.content-user .user-row:nth-of-type(${position}) .remove-user`
    )!
    this.click(element)
  }

  addEvent(value: number): void {
    const element = this.findByCss<HTMLSelectElement>('select')!
    element.selectedValue = value
    this.setSelect(element, value.toString())
  }

  private clickButton(label: string): void {
    const button = this.findAllDebugByCss('button').find(
      (b) => b.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
