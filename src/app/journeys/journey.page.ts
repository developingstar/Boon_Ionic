import { Component, OnDestroy, OnInit } from '@angular/core'
import { IonicPage, NavParams } from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { Journey } from './journey.model'
import { initialState, IState, UserAction } from './journey.page.state'
import { JourneysService } from './journeys.service'

@IonicPage({
  defaultHistory: ['JourneysPage'],
  segment: 'journey/:id'
})
@Component({
  selector: 'journey-page',
  templateUrl: 'journey.page.html'
})
export class JourneyPage implements OnInit, OnDestroy {
  private readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()
  private readonly journeyID: number
  private readonly stateSubscription: Subscription

  constructor(navParams: NavParams, private journeysService: JourneysService) {
    this.journeyID = Number(navParams.get('id'))
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

  public publishJourney(): void {
    this.uiActions.next({ name: 'publish_journey' })
  }

  public stopJourney(): void {
    this.uiActions.next({ name: 'stop_journey' })
  }

  get isLoading(): Observable<boolean> {
    return this.state.map((state) => state.isLoading)
  }

  get journey(): Observable<Journey> {
    return this.state.flatMap(
      (state) =>
        state.journey ? Observable.of(state.journey) : Observable.empty()
    )
  }

  private reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'init':
        return this.setLoading(state).concat(this.getJourney())
      case 'publish_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .publishJourney(this.journeyID)
            .map((journey) => ({
              ...state,
              isLoading: false,
              journey: journey
            }))
        )
      case 'stop_journey':
        return this.setLoading(state).concat(
          this.journeysService.stopJourney(this.journeyID).map((journey) => ({
            ...state,
            isLoading: false,
            journey: journey
          }))
        )
    }
  }

  private setLoading(state: IState): Observable<IState> {
    return Observable.of({ ...state, isLoading: true })
  }

  private getJourney(): Observable<IState> {
    return this.journeysService.journey(this.journeyID).map((journey) => ({
      isLoading: false,
      journey: journey
    }))
  }
}
