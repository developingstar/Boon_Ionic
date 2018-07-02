import { DealsIndexPage } from '../../../src/app/deals/deals-index.page'
import { PageObject } from '../../support/page.po'

export class DealsIndexPageObject extends PageObject<DealsIndexPage> {
  dealsTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  clickPrevPageButton(): void {
    this.clickButton('.deal-end button:first-of-type')
  }

  clickNextPageButton(): void {
    this.clickButton('.deal-end button:last-of-type')
  }

  clickPipelineDropdown(): void {
    this.clickButton('.pipeline-dropdown')
  }

  showingTotal(): HTMLElement {
    return this.findByCss<HTMLElement>('.deals-index-total')!
  }

  selectPipeline(position: number): void {
    const pipelineSelectors = this.findAllByCss<HTMLDivElement>(`.ng-option`)
    this.click(pipelineSelectors[position]!)
    this.fixture.detectChanges()
  }

  private clickButton(selector: string): void {
    const button = this.findDebugByCss(selector)
    this.click(button!)
  }
}
