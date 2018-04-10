import { Component, OnDestroy, OnInit } from '@angular/core'
import { IonicPage, NavController, PopoverController } from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { IHttpRequestOptions } from './../api/http-request-options'
import { Template } from './template.model'
import { initialState, IState, UserAction } from './templates.page.state'
import { TemplatesService } from './templates.service'

@IonicPage({
  segment: 'templates'
})
@Component({
  selector: 'templates-page',
  templateUrl: 'templates.page.html'
})
export class TemplatesPage implements OnInit, OnDestroy {
  readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()
  private readonly stateSubscription: Subscription

  constructor(
    private templatesService: TemplatesService,
    private popoverController: PopoverController,
    private readonly navController: NavController
  ) {
    this.state = this.uiActions
      .mergeScan((state, action) => this.reduce(state, action), initialState)
      .shareReplay()
    this.stateSubscription = this.state.subscribe()
  }

  ngOnInit(): void {
    this.uiActions.next({ name: 'list' })
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  get templates(): Observable<ReadonlyArray<Template>> {
    return this.state.map((state) => state.templates)
  }

  private reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'list':
        return this.getTemplates()
      default:
        return Observable.of(state)
    }
  }

  private getTemplates(): Observable<IState> {
    return this.templatesService.templates().map((templates) => ({
      templates: templates
    }))
  }
}
