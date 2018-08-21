import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'
import { Journey } from './journey.model'

interface IPublishJourneyAction {
  readonly name: 'stop_journey'
  readonly journey: Journey
}

interface IStopJourneyAction {
  readonly name: 'publish_journey'
  readonly journey: Journey
}

export type ActionsResult = IPublishJourneyAction | IStopJourneyAction | null

// Displays journey actions popover menu.
//
// Should be used with the Ionic PopoverController
//
// Example usage:
//
//    public showActions(event: any): void {
//      const popover = this.popoverController.create(ActionsComponent)
//      popover.present({
//        ev: event,
//      })
//    }
@IonicPage()
@Component({
  templateUrl: 'actions.component.html'
})
export class ActionsComponent {
  readonly journey: Journey

  constructor(private viewController: ViewController) {
    this.journey = viewController.data.journey
  }

  public stopJourney(): void {
    this.dismissWith({ name: 'stop_journey', journey: this.journey })
  }

  public publishJourney(): void {
    this.dismissWith({ name: 'publish_journey', journey: this.journey })
  }

  private dismissWith(action: ActionsResult): void {
    this.viewController.dismiss(action)
  }
}
