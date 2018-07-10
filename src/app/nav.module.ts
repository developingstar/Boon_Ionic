import { PortalModule } from '@angular/cdk/portal'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { DetectClickDirective } from './_directives/detect-click.directive'
import { AuthService } from './auth/auth.service'
import { ContactFilterService } from './nav/contact.filter.service'
import { NavContentComponent } from './nav/nav-content.component'
import { NavIconsComponent } from './nav/nav-icons.component'
import { NavComponent } from './nav/nav.component'

@NgModule({
  declarations: [
    NavComponent,
    NavContentComponent,
    DetectClickDirective,
    NavIconsComponent
  ],
  exports: [
    NavComponent,
    NavContentComponent,
    DetectClickDirective,
    NavIconsComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    PortalModule,
    AutoCompleteModule,
    IonicPageModule.forChild(NavComponent)
  ],
  providers: [ContactFilterService, AuthService]
})
export class NavModule {}
