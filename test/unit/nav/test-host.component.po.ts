import { PageObject } from '../../support/page.po'
import { TestHostComponent } from './test-host.component'

export class TestHostPageObject extends PageObject<TestHostComponent> {
  isNavHidden(): boolean {
    const el = this.findByCss<HTMLElement>('nav .nav-container')!
    return el.classList.contains('hidden')
  }

  getNavContent(placement: 'center' | 'right' | 'icons-left'): string | null {
    return this.findByCss<HTMLElement>(`nav .nav-${placement}`)!.textContent
  }

  getDivContent(): string | null {
    const el = this.findByCss<HTMLDivElement>('nav .search-bar')!
    return el !== null ? el.textContent : null
  }

  autoCompleteComponentVisible(): boolean {
    const element = this.findByCss<HTMLElement>('p-autocomplete')
    return element ? true : false
  }

  setContactName(name: string): void {
    const element = this.findByCss<HTMLInputElement>('p-autocomplete input')
    expect(element).toBeTruthy()
    this.setInput(element!, name)
  }

  filterResult(): ReadonlyArray<string> {
    return this.findAllByCss<HTMLSpanElement>('li span').map(
      (el) => el.textContent || ''
    )
  }

  clickNavRight(name: string): void {
    const item = this.findAllDebugByCss('.nav-right').find(
      (b) => b.nativeElement.textContent === name
    )!
    expect(item).toBeTruthy()
    this.detectClick(item!)
  }

  logOutButtonVisisble(): boolean {
    const link = this.findDebugByCss('.dropdown-content')
    return link ? true : false
  }

  getUsername(): string | null {
    const el = this.findByCss<HTMLElement>('nav .nav-right .username')

    if (el === null) {
      return null
    } else {
      return el.textContent
    }
  }
}
