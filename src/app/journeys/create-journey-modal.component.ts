import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular'
import { BehaviorSubject } from 'rxjs'
import { showToast } from '../utils/toast'
import { JourneysService } from './journeys.service'

@IonicPage()
@Component({
  selector: 'create-journey-modal',
  templateUrl: 'create-journey-modal.component.html'
})
export class CreateJourneyModalComponent {
  public readonly name: FormControl
  public readonly isSaving: BehaviorSubject<boolean>
  public readonly type: string

  constructor(
    public navParams: NavParams,
    private viewController: ViewController,
    private toastController: ToastController,
    private journeysService: JourneysService
  ) {
    this.name = new FormControl('', Validators.required)
    this.isSaving = new BehaviorSubject(false)
    this.type = this.navParams.get('type')
  }

  public create(): void {
    this.isSaving.next(true)
    const subscription = this.journeysService
      .createJourney({
        journey: {
          actions: [],
          name: this.name.value,
          triggers: [],
          type: this.type
        }
      })
      .finally(() => {
        subscription.unsubscribe()
        this.isSaving.next(false)
      })
      .subscribe(
        (journey) => {
          this.viewController.dismiss({
            journey: journey
          })
        },
        (error) => {
          if (error.status === 422) {
            showToast(
              this.toastController,
              'The journey name must be unique.',
              2000,
              false
            )
          }
        }
      )
  }

  public cancel(): void {
    this.viewController.dismiss(null)
  }
}
