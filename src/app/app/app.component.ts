import { Component, ViewChild } from '@angular/core'
import { NavController, ViewController } from 'ionic-angular'

import { CurrentUserService } from '../auth/current-user.service'

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild('nav') readonly nav: NavController

  readonly rootPage: string = 'LoginPage'

  constructor(private readonly currentUserService: CurrentUserService) {}

  ngAfterViewInit(): void {
    this.currentUserService.isAuthenticated().subscribe((isAuthenticated) => {
      const activePage: ViewController | undefined = this.nav.getActive()

      if (!isAuthenticated && activePage && activePage.name !== this.rootPage) {
        this.nav.setRoot(this.rootPage)
      }
    })
  }
}
