import { DebugElement } from '@angular/core'
import { ComponentFixture } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

export class PageObject<T> {
  readonly fixture: ComponentFixture<T>
  readonly debugElement: DebugElement

  constructor(param: DebugElement | ComponentFixture<T>) {
    if (param instanceof DebugElement) {
      this.debugElement = param
    } else {
      this.debugElement = param.debugElement
      this.fixture = param
    }
  }

  click(element: any): void {
    if (typeof element.click === 'function') {
      element.click()
    } else {
      // button: 0 stands for left click
      element.triggerEventHandler('click', { button: 0 })
    }
  }

  findPoByCss<t>(
    pageObjectType: new (de: DebugElement) => t,
    selector: string
  ): t | null {
    const debugElement = this.findDebugByCss(selector)
    return debugElement ? new pageObjectType(debugElement) : null
  }

  findAllPoByCss<t>(
    pageObjectType: new (de: DebugElement) => t,
    selector: string
  ): t[] {
    return this.findAllDebugByCss(selector).map((de) => new pageObjectType(de))
  }

  findByCss<t>(selector: string): t | null {
    const debugElement = this.findDebugByCss(selector)
    return debugElement ? debugElement.nativeElement : null
  }

  findAllByCss<t>(selector: string): t[] {
    return this.findAllDebugByCss(selector).map((de) => de.nativeElement)
  }

  findDebugByCss(selector: string): DebugElement | null {
    return this.debugElement.query(By.css(selector))
  }

  findAllDebugByCss(selector: string): DebugElement[] {
    return this.debugElement.queryAll(By.css(selector))
  }

  setInput(input: HTMLInputElement, value: string): void {
    input.value = value
    input.dispatchEvent(new Event('input'))
  }

  setSelect(select: HTMLSelectElement, value: string): void {
    select.value = value
    select.dispatchEvent(new Event('change'))
  }
}
