import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { IonicPage, NavParams } from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import {
  initialState,
  IState,
  UserAction
} from './integration.page.state'
import { IntegrationsService } from './integrations.service'
import { Service } from './service.model'

@IonicPage({
  segment: 'integration/:id'
})
@Component({
  selector: 'integration-page',
  templateUrl: 'integration.page.html'
})
export class IntegrationPage implements OnInit, OnDestroy {
  private readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()
  private readonly serviceID: number
  private readonly stateSubscription: Subscription

  constructor(
    navParams: NavParams,
    private readonly integrationsService: IntegrationsService
  ) {
    this.serviceID = Number(navParams.get('id'))
    this.state = this.uiActions
      .mergeScan((state, action) => this.reduce(state, action), initialState)
      .shareReplay()
    this.stateSubscription = this.state.subscribe()
  }

  ngOnInit(): void {
    this.uiActions.next({ name: 'edit' })
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  public updateService(): void {
    this.uiActions.next({ name: 'update_service' })
  }

  get service(): Observable<Service> {
    return this.state.flatMap(
      (state) =>
        state.service ? Observable.of(state.service) : Observable.empty()
    )
  }

  private reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'edit':
        return this.getService()
      case 'update_service':
        return this.integrationsService
            .updateService(this.serviceID, state.service)
            .map((service) => ({
              ...state,
              service: service
            }))
      default:
        return Observable.of(state)
    }
  }

  private getService(): Observable<IState> {
    return this.integrationsService.service(this.serviceID).map((service) => ({
      service: service
    }))
  }
}
