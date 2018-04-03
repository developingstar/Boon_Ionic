import { DebugElement } from '@angular/core'

import { NewLeadPage } from '../../../src/app/crm/new-lead.page'
import { PageObject } from '../../support/page.po'
import { FieldPageObject } from './field.component.po'

export class NewLeadPageObject extends PageObject<NewLeadPage> {
  get baseFieldLabels(): string[] {
    return this.findAllPoByCss(FieldPageObject, '.base-fields field').map(
      (f) => f.label
    )
  }

  get customFieldLabels(): string[] {
    return this.findAllPoByCss(FieldPageObject, '.custom-fields field').map(
      (f) => f.label
    )
  }

  get ownerFieldValue(): string {
    return this.ownerField.value
  }

  get isOwnerFieldEnabled(): boolean {
    return this.ownerField.isEnabled
  }

  get isCreateButtonEnabled(): boolean {
    return !this.getButton('Create').nativeElement.disabled
  }

  setField(name: string, value: string | number): void {
    const field = this.findAllPoByCss(FieldPageObject, 'field').find(
      (f) => f.label === name
    )
    expect(field).toBeTruthy()
    field!.setValue(value)
  }

  clickCreateButton(): void {
    this.click(this.getButton('Create'))
  }

  clickCancelButton(): void {
    this.click(this.getButton('Cancel'))
  }

  private get ownerField(): FieldPageObject {
    const field = this.findAllPoByCss(
      FieldPageObject,
      '.base-fields field'
    ).find((f) => f.label === 'Owner')
    expect(field).toBeTruthy()
    return field!
  }

  private getButton(label: string): DebugElement {
    const button = this.findAllDebugByCss('button').find(
      (de) => de.nativeElement.textContent === label
    )
    expect(button).toBeTruthy()
    return button!
  }
}
