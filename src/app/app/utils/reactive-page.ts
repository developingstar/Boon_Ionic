import { OnDestroy, OnInit } from '@angular/core'
import { Observable, Subject, Subscription } from 'rxjs'

export abstract class ReactivePage<State, UserAction>
  implements OnInit, OnDestroy {
  protected readonly state: Observable<State>
  protected readonly uiActions: Subject<UserAction> = new Subject()
  protected readonly stateSubscription: Subscription

  constructor(initialState: State) {
    this.state = this.uiActions
      .mergeScan((state, action) => this.reduce(state, action), initialState)
      .shareReplay()
    this.stateSubscription = this.state.subscribe()
  }

  ngOnInit(): void {
    this.uiActions.next(this.initialAction())
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  protected abstract initialAction(): UserAction
  protected abstract reduce(state: State, action: UserAction): Observable<State>
}
