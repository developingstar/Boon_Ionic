import { Component, ViewEncapsulation } from '@angular/core'
import { App } from 'ionic-angular'
import { Observable } from 'rxjs'

import { AuthService } from './../auth/auth.service'
import { CurrentUserService } from './../auth/current-user.service'
import { ContactFilterService } from './contact.filter.service'
import { NavContent, NavService } from './nav.service'
// Main navigation bar.
//
// Displays a responsive navigation bar at the top of the application. The navbar contains the
// application icon and two customizable sections: center and right. The sections are defined
// by specific pages. See docs for NavContentComponent for examples.
//
// The component is implemented using portals from Angular Material CDK.
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'nav',
  templateUrl: 'nav.component.html'
})
export class NavComponent {
  readonly centerContent: Observable<NavContent>
  readonly navClass: Observable<string>
  readonly rightContent: Observable<NavContent>
  public logoutclicks: number = 0
  selectedItem: any
  results: Crm.API.ISearchDropdownItem[]

  constructor(
    protected app: App,
    private readonly authService: AuthService,
    private readonly currentUserService: CurrentUserService,
    public readonly filterService: ContactFilterService,
    navService: NavService
  ) {
    this.centerContent = navService.contentUpdated.map((portals) => portals[0])
    this.rightContent = navService.contentUpdated.map((portals) => portals[1])
    this.navClass = navService.navBarVisible.map(
      (value) => (value ? 'visible' : 'hidden')
    )
  }

  get username(): Observable<string | undefined> {
    return this.currentUserService.details.map(
      (details) => (details ? details.name : undefined)
    )
  }

  public onInput(event: any): void {
    return
  }

  public onCancel(event: any): void {
    return
  }

  public goToCrm(): void {
    const navHome = this.app.getRootNav()
    navHome.setRoot('CrmPage')
  }

  public itemSelected(event: any): void {
    if (event.id) {
      const nav = this.app.getRootNav()
      nav.setRoot('ContactPage', { id: event.id })
    }
  }

  public search(event: any): void {
    this.filterService
      .getResults(event.query)
      .subscribe((results: Crm.API.ISearchDropdownItem[]) => {
        this.results =
          results.length > 3
            ? results.filter(
                (result: Crm.API.ISearchDropdownItem, index: number) =>
                  index < 3
              )
            : results.map(
                (result: Crm.API.ISearchDropdownItem, index: number) => result
              )
      })
  }

  public logoutOn3(): void {
    this.logoutclicks++
    setTimeout(() => {
      this.logoutclicks = 0
    }, 1000)
    if (this.logoutclicks === 3) {
      this.authService.logout()
    }
  }
}
