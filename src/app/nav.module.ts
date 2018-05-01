import { PortalModule } from '@angular/cdk/portal'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'

import { NavContentComponent } from './nav/nav-content.component'
import { NavIconsComponent } from './nav/nav-icons.component'
import { NavComponent } from './nav/nav.component'

@NgModule({
  declarations: [NavComponent, NavContentComponent, NavIconsComponent],
  exports: [NavComponent, NavContentComponent, NavIconsComponent],
  imports: [CommonModule, InlineSVGModule, PortalModule, IonicPageModule.forChild(NavComponent)]
})
export class NavModule {}
