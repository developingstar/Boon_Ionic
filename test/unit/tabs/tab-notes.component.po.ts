import { TabNotesComponent } from '../../../src/app/show-tabs/tab-notes.component'
import { PageObject } from '../../support/page.po'

export class TabNotesComponentObject extends PageObject<TabNotesComponent> {
  getNotes(): Array<string | null> {
    return this.findAllByCss<HTMLDivElement>('.note-content').map((el) => {
      return el.textContent
    })
  }

  setNote(note: string): void {
    const element = this.findByCss<HTMLInputElement>('input.note')
    expect(element).toBeTruthy()
    this.setInput(element!, note)
  }

  getNote(): string {
    const element = this.findByCss<HTMLInputElement>('input.note')
    expect(element).toBeTruthy()
    return element!.value
  }

  clickAddNote(): void {
    const img = this.findDebugByCss('div.send-button img')
    expect(img).toBeTruthy()
    this.click(img!)
  }
}
