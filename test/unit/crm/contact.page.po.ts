import { DebugElement } from '@angular/core'
import { ContactPage } from '../../../src/app/crm/contact.page'
import { PageObject } from '../../support/page.po'
import { FieldPageObject } from './field.component.po'

export class ContactPageObject extends PageObject<ContactPage> {
  get contactName(): string | null {
    return this.findByCss<HTMLElement>('h1')!.textContent || null
  }

  get baseFieldValues(): string[] {
    return this.findAllPoByCss(FieldPageObject, '.base-fields field').map(
      (f) => f.value
    )
  }

  get dateFieldValue(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLDivElement>('div.date').map(
      (el) => el.textContent || ''
    )
  }

  get customFieldLabels(): string[] {
    return this.customFields.map((f) => f.label)
  }

  get customFieldValues(): string[] {
    return this.customFields.map((f) => f.value)
  }

  get buttons(): string[] {
    return this.findAllByCss<HTMLElement>('.buttons button').map(
      (el) => el.textContent || ''
    )
  }

  get updateStageBtn(): DebugElement {
    const item = this.findDebugByCss('.update-stage-button')
    return item!
  }

  get isSaveButtonEnabled(): boolean {
    const button = this.findAllByCss<HTMLButtonElement>('.buttons button').find(
      (b) => b.textContent === 'Save'
    )
    expect(button).toBeTruthy()
    return !button!.disabled
  }

  get isEditMode(): boolean {
    return this.emailField.isEnabled
  }

  get emailField(): FieldPageObject {
    const field = this.findAllPoByCss(
      FieldPageObject,
      '.base-fields field'
    ).find((f) => f.label === 'Email')
    expect(field).toBeTruthy()
    return field!
  }

  get ownerField(): FieldPageObject {
    const field = this.findAllPoByCss(
      FieldPageObject,
      '.base-fields field'
    ).find((f) => f.label === 'Owner')
    expect(field).toBeTruthy()
    return field!
  }

  get customFields(): FieldPageObject[] {
    return this.findAllPoByCss(FieldPageObject, '.custom-fields field')
  }

  get notes(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLDivElement>('div.note-content').map(
      (el) => el.textContent || ''
    )
  }

  clickUpdateStage(): any {
    this.click(this.updateStageBtn!)
    this.fixture.detectChanges()
  }

  selectStage(position: number): void {
    const selector = `.item-container:nth-child(${position})`
    const item = this.findDebugByCss(selector)
    this.click(item!)
    this.fixture.detectChanges()
  }

  setNote(note: string): void {
    const element = this.findByCss<HTMLInputElement>('ion-input input')
    expect(element).toBeTruthy()
    this.setInput(element!, note)
  }

  clickAddNote(): void {
    const img = this.findDebugByCss('div.send-button img')
    expect(img).toBeTruthy()
    this.click(img!)
  }

  clickBackButton(): void {
    this.click(this.findDebugByCss('#back-button')!)
  }

  clickEditButton(): void {
    this.clickButton('Edit')
  }

  clickSaveButton(): void {
    this.clickButton('Save')
  }

  clickCancelButton(): void {
    this.clickButton('Cancel')
  }

  openPopover(): void {
    const button = this.findDebugByCss('.contact-more-button')
    this.click(button!)
  }

  private clickButton(name: string): void {
    const button = this.findAllDebugByCss('.buttons button').find(
      (de) => de.nativeElement.textContent === name
    )
    expect(button).toBeTruthy()
    this.click(button!)
  }
}
