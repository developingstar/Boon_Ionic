import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { BehaviorSubject } from 'rxjs'

import { AuthService } from './auth.service'

@IonicPage({
  segment: 'confirmcode'
})
@Component({
  selector: 'confirm-code-page',
  templateUrl: 'confirm.code.page.html'
})
export class ConfirmCodePage implements OnInit {
  public readonly code: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(
    private readonly authService: AuthService,
    private readonly nav: NavController
  ) {}

  ngOnInit(): void {
    return
  }

  public confirmCode(): void {
    const code = this.code.getValue() as string
    this.authService.sendCode(code)
  }

  public goLogin(): void {
    this.nav.setRoot('LoginPage')
  }

  set codeModel(value: string) {
    this.code.next(value)
  }
}
