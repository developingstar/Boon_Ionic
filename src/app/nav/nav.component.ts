import { Component, ViewEncapsulation } from '@angular/core'
import { App } from 'ionic-angular'
import { Observable } from 'rxjs'
import { AuthService } from './../auth/auth.service'
import { CurrentUserService } from './../auth/current-user.service'
import { LeadFilterService } from './lead.filter.service'
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
  readonly iconsLeftContent: Observable<NavContent>
  public logoutclicks: number = 0
  public active: boolean
  selectedItem: any
  results: Crm.API.ISearchDropdownItem[]
  query: string

  constructor(
    protected app: App,
    private readonly authService: AuthService,
    private readonly currentUserService: CurrentUserService,
    public readonly filterService: LeadFilterService,
    navService: NavService
  ) {
    this.centerContent = navService.contentUpdated.map((portals) => portals[0])
    this.iconsLeftContent = navService.contentUpdated.map(
      (portals) => portals[1]
    )
    this.rightContent = navService.contentUpdated.map((portals) => portals[2])
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

  public goToPage(page: string): void {
    const navHome = this.app.getRootNav()
    navHome.setRoot(page)
  }

  public itemSelected(event: any): void {
    if (event.id) {
      const nav = this.app.getRootNav()
      if (event.type === 'contact') {
        nav.push('ContactShowPage', { id: event.id })
      }
    } else if (event.id === 0) {
      this.selectedItem = {
        id: 0,
        name: this.query
      }
    }
  }

  public search(event: any): void {
    this.query = event.query
    this.filterService
      .getResults(event.query)
      .subscribe((results: Crm.API.ISearchDropdownItem[]) => {
        this.results =
          results.length > 3
            ? results.filter(
                (result: Crm.API.ISearchDropdownItem, index: number) =>
                  index < 3
              )
            : results.map((result: Crm.API.ISearchDropdownItem) => result)
        if (this.results.length !== 0) {
          this.results.push({
            id: 0,
            name: 'See all results'
          })
        }
      })
  }

  public logout(): void {
    this.authService.logout()
  }

  detectClick(click: any): void {
    if (this.active === true && click === true)
      // tslint:disable-next-line:no-parameter-reassignment
      click = false
    this.active = click
  }

  public gotoResultPage(): void {
    const navHome = this.app.getRootNav()
    navHome.setRoot('SearchResultsPage', { query: this.query })
  }
}
