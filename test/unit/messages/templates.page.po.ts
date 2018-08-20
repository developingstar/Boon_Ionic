import { PageObject } from '../../support/page.po'

export class TemplatesPageObject<T> extends PageObject<T> {
  getTemplatesTable(): HTMLElement {
    return this.findByCss<HTMLElement>('.table')!
  }

  showTemplate(position: number): void {
    const element = this.findDebugByCss(
      `.table .template-row:nth-of-type(${position})`
    )!

    this.click(element)
  }

  newTemplate(): void {
    const element = this.findDebugByCss(`.new-template`)!
    this.click(element)
  }

  get header(): string {
    const h2 = this.findByCss<HTMLHeadingElement>('h2')
    return h2 ? h2.textContent || '' : ''
  }
}
