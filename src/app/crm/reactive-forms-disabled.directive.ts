import { Directive, DoCheck, Optional } from '@angular/core'
import { NgControl } from '@angular/forms'

// Workaround for updating disabled state for reactive forms.
// https://github.com/angular/angular/issues/15206#issuecomment-322926883
@Directive({
  selector: '[formControl], [formControlName]'
})
export class ReactiveFormsDisabledDirective implements DoCheck {
  constructor(@Optional() private control: NgControl) {}

  ngDoCheck(): void {
    if (
      this.control &&
      this.control.valueAccessor &&
      this.control.valueAccessor.setDisabledState
    ) {
      this.control.valueAccessor.setDisabledState(
        this.control.disabled === true
      )
    }
  }
}
