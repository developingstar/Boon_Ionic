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
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
