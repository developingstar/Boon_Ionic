import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, NavParams, ViewController } from 'ionic-angular'

@IonicPage()
@Component({
  selector: 'edit-stage-modal-page',
  templateUrl: 'edit-stage-modal.page.html'
})
export class EditStageModalPage {
  public readonly title: string
  public readonly nameInput: FormControl

  constructor(params: NavParams, private viewCtrl: ViewController) {
    this.nameInput = new FormControl(
      params.get('initialName') || '',
      Validators.required
    )
    this.title = params.get('title')
  }

  cancel(): void {
    this.viewCtrl.dismiss()
  }

  save(): void {
    this.viewCtrl.dismiss({ name: this.nameInput.value })
  }
}
