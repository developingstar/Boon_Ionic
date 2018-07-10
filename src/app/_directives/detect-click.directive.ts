import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core'

@Directive({
  selector: '[detectClick]'
})
export class DetectClickDirective {
  clickIsInsideElement = false
  active = false
  @Output() detectClick = new EventEmitter<boolean>()

  constructor(private elRef: ElementRef) {}

  @Input()
  listen(active: boolean): void {
    this.active = active
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any): void {
    this.clickIsInsideElement = this.elRef.nativeElement.contains(targetElement)
    this.detectClick.emit(this.clickIsInsideElement)
  }
}
