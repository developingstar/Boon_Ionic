import { Component, ElementRef, Input } from '@angular/core'

declare const PS: {
  [key: string]: (el: any) => (() => void)
}

@Component({
  selector: 'purescript-component',
  template: '<div></div>'
})
export class PurescriptComponent {
  @Input() readonly func: string

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    const f = PS[this.func]
    if (f === undefined) {
      throw new Error(`No such PureScript function: ${this.func}.`)
    } else {
      f(this.elRef.nativeElement)()
    }
  }
}
