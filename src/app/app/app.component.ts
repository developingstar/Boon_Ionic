import { Component, ViewChild } from '@angular/core'
import { NavController, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { LoaderService } from '../api/loader.service'
import { CurrentUserService } from '../auth/current-user.service'

declare var window: any

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild('nav') readonly nav: NavController

  public readonly isLoaded: Observable<boolean>
  public readonly rootPage: string = 'LoginPage'

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly loaderService: LoaderService,
    private readonly toastController: ToastController
  ) {
    this.isLoaded = this.loaderService.pendingRequestsCounter
      .map((value) => value === 0)
      .debounceTime(50)
  }

  ngAfterViewInit(): void {
    window.PureScriptBridge.ToastController = this.toastController
    this.currentUserService.isAuthenticated().subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.nav.setRoot(this.rootPage)
      }
    })
  }
}
