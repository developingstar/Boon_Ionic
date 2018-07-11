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
  public selectedNavItem: string
  public categoryType: string
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
    this.stateSubscription = this.state.subscribe((state) => {
      this.categoryType = state.category
    })
  }
  ngOnInit(): void {
    this.selectedNavItem = 'contact'
    this.uiActions.next({ name: 'init', category: 'contact' })
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
    this.navController.setRoot('JourneyBoardPage', { id: journey.id })
  }

  public openNewJourneyModal(event: Event): void {
    const type = { type: this.categoryType }
    const modal = this.modalController.create(
      CreateJourneyModalComponent.name,
      type,
      { cssClass: 'create-journey-modal' }
    )
    modal.present({ ev: event })
    modal.onDidDismiss((data?: { readonly journey?: Journey }) => {
      if (data && data.journey) {
        this.showJourney(data.journey)
      }
    })
  }

  public type(): any {
    return this.state.flatMap((state) => state.category)
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

  public setNavItem(item: string): void {
    this.selectedNavItem = item
    this.uiActions.next({ name: 'init', category: this.selectedNavItem })
  }

  get buttonName(): Observable<string> {
    return this.state.flatMap(
      (state) =>
        state.category === 'contact'
          ? Observable.of('New Contact Journey')
          : Observable.of('New Deal Journey')
    )
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
          this.getJourneys(state.requestOptions, action.category)
        )
      case 'prev':
        return this.setLoading(state).concat(
          this.getJourneys(
            {
              ...state.requestOptions,
              url: state.journeys.prevPageLink
            },
            state.category
          )
        )
      case 'next':
        return this.setLoading(state).concat(
          this.getJourneys(
            {
              ...state.requestOptions,
              url: state.journeys.nextPageLink
            },
            state.category
          )
        )
      case 'publish_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .publishJourney(action.journey.id)
            .flatMap((journey) =>
              this.getJourneys(state.requestOptions, state.category)
            )
        )
      case 'stop_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .stopJourney(action.journey.id)
            .flatMap((journey) =>
              this.getJourneys(state.requestOptions, state.category)
            )
        )
      case 'delete_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .deleteJourney(action.journey.id)
            .flatMap((journey) =>
              this.getJourneys(state.requestOptions, state.category)
            )
        )
    }
  }

  private setLoading(state: IState): Observable<IState> {
    return Observable.of({ ...state, isLoading: true })
  }

  private getJourneys(
    requestOptions: IHttpRequestOptions,
    category: string = 'contact'
  ): Observable<IState> {
    return this.journeysService
      .journeys(requestOptions, category)
      .map((newJourneys) => ({
        category: category,
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
