import { GroupsPage } from '../../../src/app/settings/groups.page'
import { PageObject } from '../../support/page.po'

export class GroupsPageObject extends PageObject<GroupsPage> {
  get addPipelineButtonVisible(): boolean {
    return this.elementVisible('button', 'Add Pipeline')
  }

  get savePipelineButtonEnabled(): boolean {
    return this.inputEnabled('button', 'Save Pipeline')
  }

  clickAddPipelineButton(): void {
    this.clickButton('Add Pipeline')
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

  get pipelines(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('button.button-with-arrow').map(
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
