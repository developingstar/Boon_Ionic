import { IntegrationPage } from '../../../src/app/settings/integration.page'
import { PageObject } from '../../support/page.po'

export class IntegrationPageObject extends PageObject<IntegrationPage> {
  get updateServiceButtonVisible(): boolean {
    return this.elementVisible('button', 'Update Info')
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

  get token(): string {
    const token = this.findByCss<HTMLInputElement>('input')
    return token ? token.value || '' : ''
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
