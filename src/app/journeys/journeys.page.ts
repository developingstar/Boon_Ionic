import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  IonicPage,
  ModalController,
  NavController,
  PopoverController
} from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { IHttpRequestOptions } from './../api/http-request-options'
import { ActionsComponent, ActionsResult } from './actions.component'
import { CreateJourneyModalComponent } from './create-journey-modal.component'
import { Journey } from './journey.model'
import { initialState, IState, UserAction } from './journeys.page.state'
import { JourneysService } from './journeys.service'

@IonicPage({
  segment: 'journeys'
})
@Component({
  selector: 'journeys-page',
  templateUrl: 'journeys.page.html'
})
export class JourneysPage implements OnInit, OnDestroy {
  readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()
  private readonly stateSubscription: Subscription

  constructor(
    private journeysService: JourneysService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private readonly navController: NavController,
    private currentUserService: CurrentUserService
  ) {
    this.state = this.uiActions
      .mergeScan((state, action) => this.reduce(state, action), initialState)
      .shareReplay()
    this.stateSubscription = this.state.subscribe()
  }
  ngOnInit(): void {
    this.uiActions.next({ name: 'init' })
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  public loadPrevPage(): void {
    this.uiActions.next({ name: 'prev' })
  }

  public loadNextPage(): void {
    this.uiActions.next({ name: 'next' })
  }

  public showJourney(journey: Journey): void {
    this.navController.setRoot('JourneyPage', { id: journey.id })
  }

  public openNewJourneyModal(event: Event): void {
    const modal = this.modalController.create(
      CreateJourneyModalComponent.name,
      {},
      { cssClass: 'create-journey-modal' }
    )
    modal.present({ ev: event })
    modal.onDidDismiss((data?: { readonly journey?: Journey }) => {
      if (data && data.journey) {
        this.showJourney(data.journey)
      }
    })
  }

  public showActions(event: any, journey: Journey): void {
    const popover = this.popoverController.create(
      ActionsComponent.name,
      {
        journey: journey
      },
      { cssClass: 'boon-popover' }
    )
    popover.present({ ev: event })
    popover.onDidDismiss((data: ActionsResult) => {
      if (data) {
        this.uiActions.next(data)
      }
    })
  }

  get isPrevPageButtonDisabled(): Observable<boolean> {
    return this.state.map((state) => {
      return state.isLoading || state.journeys.prevPageLink === null
    })
  }

  get isNextPageButtonDisabled(): Observable<boolean> {
    return this.state.map(
      (state) => state.isLoading || state.journeys.nextPageLink === null
    )
  }

  get journeys(): Observable<ReadonlyArray<Journey>> {
    return this.state.map((state) => state.journeys.items)
  }

  private reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'init':
        return this.setLoading(state).concat(
          this.getJourneys(state.requestOptions)
        )
      case 'prev':
        return this.setLoading(state).concat(
          this.getJourneys({
            ...state.requestOptions,
            url: state.journeys.prevPageLink
          })
        )
      case 'next':
        return this.setLoading(state).concat(
          this.getJourneys({
            ...state.requestOptions,
            url: state.journeys.nextPageLink
          })
        )
      case 'publish_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .publishJourney(action.journey.id)
            .flatMap((journey) => this.getJourneys(state.requestOptions))
        )
      case 'stop_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .stopJourney(action.journey.id)
            .flatMap((journey) => this.getJourneys(state.requestOptions))
        )
    }
  }

  private setLoading(state: IState): Observable<IState> {
    return Observable.of({ ...state, isLoading: true })
  }

  private getJourneys(requestOptions: IHttpRequestOptions): Observable<IState> {
    return this.journeysService.journeys(requestOptions).map((newJourneys) => ({
      isLoading: false,
      journeys: newJourneys,
      requestOptions: requestOptions
    }))
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).JourneysPage !== undefined
  }
}
