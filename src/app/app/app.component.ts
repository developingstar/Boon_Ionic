import { Component, ViewChild } from '@angular/core'
import { NavController, ViewController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { LoaderService } from '../api/loader.service'
import { CurrentUserService } from '../auth/current-user.service'

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
    private readonly loaderService: LoaderService
  ) {
    this.isLoaded = this.loaderService.pendingRequestsCounter
      .map((value) => value === 0)
      .debounceTime(50)
  }

  ngAfterViewInit(): void {
    this.currentUserService.isAuthenticated().subscribe((isAuthenticated) => {
      const activePage: ViewController | undefined = this.nav.getActive()
      if (!isAuthenticated) {
        this.nav.setRoot(this.rootPage)
      }
    })
  }
}
