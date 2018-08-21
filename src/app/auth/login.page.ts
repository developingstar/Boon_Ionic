import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { BehaviorSubject } from 'rxjs'

import { NavService } from '../nav/nav.service'
import { AuthService } from './auth.service'
import { CurrentUserService } from './current-user.service'

@IonicPage({
  segment: 'login'
})
@Component({
  selector: 'login-page',
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  public readonly email: BehaviorSubject<string> = new BehaviorSubject('')
  private readonly password: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(
    private readonly authService: AuthService,
    private readonly currentUserService: CurrentUserService,
    private readonly nav: NavController,
    private readonly navService: NavService
  ) {}

  ngOnInit(): void {
    this.currentUserService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.nav.setRoot('CrmPage')
      }
    })

    this.navService.navBarVisible.next(false)
  }

  public login(): void {
    const email = this.email.getValue() as string
    const password = this.password.getValue() as string

    this.authService.login(email, password)
  }

  public gotoForgot(): void {
    this.nav.setRoot('SendCodePage')
  }

  set emailModel(value: string) {
    this.email.next(value)
  }

  set passwordModel(value: string) {
    this.password.next(value)
  }
}
