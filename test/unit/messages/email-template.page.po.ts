import { EmailTemplatePage } from '../../../src/app/messages/email-template.page'
import { TemplatePageObject } from './template.page.po'

export class EmailTemplatePageObject extends TemplatePageObject<
  EmailTemplatePage
> {
  getSubject(): string {
    return this.findByCss<HTMLInputElement>('input[name="subject"]')!.value
  }

  setSubject(value: string): void {
    this.setInputByName('subject', value)
  }

  getFromName(): string {
    return this.findByCss<HTMLInputElement>(
      'input[name="default_sender_name"]'
    )!.value
  }

  setFromName(value: string): void {
    this.setInputByName('default_sender_name', value)
  }

  getFromEmail(): string {
    return this.findByCss<HTMLInputElement>('input[name="default_sender"]')!
      .value
  }

  setFromEmail(value: string): void {
    this.setInputByName('default_sender', value)
  }
}
