import { CrmPage } from '../../../src/app/crm/crm.page'
import { PageObject } from '../../support/page.po'

export class CrmPageObject extends PageObject<CrmPage> {
  pipelinesNavElements(): NodeListOf<HTMLSpanElement> {
    const nav = this.findByCss<HTMLElement>('.nav-pipelines ion-row')!
    return nav.querySelectorAll('span')
  }

  stagesNav(): HTMLElement {
    return this.findByCss<HTMLElement>('.nav-stages')!
  }

  stagesNavElements(): NodeListOf<HTMLSpanElement> {
    const nav = this.findByCss<HTMLElement>('.nav-stages pipeline')!
    return nav.querySelectorAll('.item-container')
  }

  leadsTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  clickPrevPageButton(): void {
    this.clickButton('.footer button:first-of-type')
  }

  clickNextPageButton(): void {
    this.clickButton('.footer button:last-of-type')
  }

  clickNewContactButton(): void {
    this.clickButton('button.new-contact')
  }

  selectPipeline(position: number): void {
    const selector = `.nav-pipelines ion-row ion-col:nth-child(${position}) span`
    const item = this.findDebugByCss(selector)
    this.click(item!)
    this.fixture.detectChanges()
  }

  selectStage(position: number): void {
    const selector = `.nav-stages .item-container:nth-child(${position})`
    const item = this.findDebugByCss(selector)
    this.click(item!)
    this.fixture.detectChanges()
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
