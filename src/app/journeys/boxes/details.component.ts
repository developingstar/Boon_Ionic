import { Input, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subject, Subscription } from 'rxjs'

export abstract class DetailsComponent<Event, Record>
  implements OnDestroy, OnInit {
  @Input() protected readonly event: Event

  protected readonly object: Observable<Record | undefined>

  private readonly eventChanges: Subject<Event> = new Subject()
  private readonly subscription: Subscription

  constructor() {
    this.object = this.eventChanges
      .concatMap((event) => this.fetchRecord())
      .shareReplay(1)
    this.subscription = this.object.subscribe()
  }

  ngOnInit(): void {
    this.eventChanges.next(this.event)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get details(): Observable<string> {
    return this.object.map(
      (object) => (object === undefined ? '' : this.detail(object))
    )
  }

  protected abstract fetchRecord(): Observable<Record | undefined>
  protected abstract detail(object: Record): string
}
