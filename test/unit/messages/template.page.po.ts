import { PageObject } from '../../support/page.po'

export class TemplatePageObject<T> extends PageObject<T> {
  getName(): string {
    return this.findByCss<HTMLInputElement>('input[name="name"]')!.value
  }

  setName(value: string): void {
    this.setInputByName('name', value)
  }

  getContent(): string {
    return this.findByCss<HTMLTextAreaElement>('textarea[name="content"]')!
      .value
  }

  setContent(value: string): void {
    this.setTextareaByName('content', value)
  }

  getShortcodes(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('.shortcodes option').map(
      (el) => el.textContent || ''
    )
  }

  save(): void {
    const element = this.findDebugByCss('.form button')!
    this.click(element)
  }

  addShortcodeEvent(value: string): void {
    const element = this.findByCss<HTMLSelectElement>('.shortcodes select')
    expect(element).toBeTruthy()
    element!.selectedValue = value
    this.setSelect(element!, value)
  }
}
