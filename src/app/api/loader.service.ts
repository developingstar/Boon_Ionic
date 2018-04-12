import { Injectable, OnDestroy } from '@angular/core'
import { Observable, Subject, Subscription } from 'rxjs'

@Injectable()
export class LoaderService implements OnDestroy {
  public readonly pendingRequestsCounter: Observable<number>

  private readonly counterSubscription: Subscription
  private readonly updateCounterBy: Subject<number> = new Subject()

  constructor() {
    this.pendingRequestsCounter = this.updateCounterBy
      .startWith(0)
      .scan((value, change) => value + change)
      .shareReplay()

    this.counterSubscription = this.pendingRequestsCounter.subscribe()
  }

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe()
  }

  public incrementPendingRequests(): void {
    this.updateCounterBy.next(1)
  }

  public decrementPendingRequests(): void {
    this.updateCounterBy.next(-1)
  }
}
