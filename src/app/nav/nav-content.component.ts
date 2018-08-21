import { CdkPortal } from '@angular/cdk/portal'
import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren
} from '@angular/core'

import { NavService } from './nav.service'

// Content of the nav bar.
//
// Used this component to customize the content of the nav bar. Example:
//
// nav-content
//   div(center)
//     p
//       | This goes in the center
//
//   div(right)
//     p
//       | This goes on the right.
//
// Note that both parts are optional.
@Component({
  selector: 'nav-content',
  templateUrl: 'nav-content.component.html'
})
export class NavContentComponent implements AfterViewInit {
  @ViewChildren(CdkPortal) readonly portalsQuery: QueryList<CdkPortal>

  constructor(private readonly navService: NavService) {}

  ngAfterViewInit(): void {
    const portals = this.portalsQuery.toArray()
    // Since the nav component probably already went through the change detection cycle,
    // this update has to happen asynchronously.
    setTimeout(() => {
      this.navService.contentUpdated.next([portals[0], portals[1]])
      this.navService.navBarVisible.next(true)
    }, 0)
  }
}
