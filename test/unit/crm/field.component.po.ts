import { FieldComponent } from '../../../src/app/crm/field.component'
import { PageObject } from '../../support/page.po'

export class FieldPageObject extends PageObject<FieldComponent> {
  get type(): 'input' | 'select' {
    const input = this.findByCss<HTMLInputElement>('input')
    return input ? 'input' : 'select'
  }

  get label(): string {
    return this.findByCss<HTMLElement>('.field-label')!.textContent || ''
  }

  get value(): string {
    return this.type === 'input'
      ? this.findByCss<HTMLInputElement>('input')!.value
      : this.findByCss<HTMLSelectElement>('select')!.value
  }

  get isEnabled(): boolean {
    return this.type === 'input'
      ? !this.findByCss<HTMLInputElement>('input')!.disabled
      : !this.findByCss<HTMLSelectElement>('select')!.disabled
  }

  setValue(value: string | number): void {
    const val = value.toString()

    if (this.type === 'input') {
      this.setInput(this.findByCss<HTMLInputElement>('input')!, val)
    } else {
      this.setSelect(this.findByCss<HTMLSelectElement>('select')!, val)
    }
  }
}
