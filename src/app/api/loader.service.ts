import { Injectable } from '@angular/core'
import { Loading, LoadingController } from 'ionic-angular'
import { Subject } from 'rxjs'

interface ILoaderState {
  readonly instance: Loading | undefined
  readonly pendingRequests: number
}

@Injectable()
export class LoaderService {
  private readonly initialLoaderState: ILoaderState = {
    instance: undefined,
    pendingRequests: 0
  }

  private readonly loaderOptions = {
    content: 'Loading data...',
    cssClass: 'boon-loader-container',
    showBackdrop: false
  }

  private readonly pendingRequestsCounter: Subject<number> = new Subject()

  constructor(private readonly loaderController: LoadingController) {
    this.pendingRequestsCounter
      .scan((state, change) => {
        const newInstance = this.loaderInstanceFromChange(state, change)
        return {
          instance: newInstance,
          pendingRequests: state.pendingRequests + change
        }
      }, this.initialLoaderState)
      .subscribe()
  }

  public incrementPendingRequests(): void {
    this.pendingRequestsCounter.next(1)
  }

  public decrementPendingRequests(): void {
    this.pendingRequestsCounter.next(-1)
  }

  private loaderInstanceFromChange(
    state: ILoaderState,
    change: number
  ): Loading | undefined {
    if (state.pendingRequests === 0 && change > 0) {
      const instance: Loading = this.loaderController.create(this.loaderOptions)
      instance.present()
      return instance
    } else if (
      state.pendingRequests + change === 0 &&
      state.instance !== undefined
    ) {
      state.instance.dismiss()
      return undefined
    } else {
      return state.instance
    }
  }
}
