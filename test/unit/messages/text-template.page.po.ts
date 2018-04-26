import { TextTemplatePage } from '../../../src/app/messages/text-template.page'
import { TemplatePageObject } from './template.page.po'

export class TextTemplatePageObject extends TemplatePageObject<
  TextTemplatePage
> {
  getPhoneNumber(): string {
    return this.findByCss<HTMLSelectElement>('select[name="default_sender"]')!
      .value
  }

  selectPhoneNumber(value: string): void {
    this.setSelectByName('default_sender', value)
  }
}
