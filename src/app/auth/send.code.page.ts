import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { BehaviorSubject } from 'rxjs'

import { AuthService } from './auth.service'

@IonicPage({
  segment: 'sendcode'
})
@Component({
  selector: 'send-code-page',
  templateUrl: 'send.code.page.html'
})
export class SendCodePage implements OnInit {
  public readonly email: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(
    private readonly authService: AuthService,
    private readonly nav: NavController
  ) {}

  ngOnInit(): void {
    return
  }

  public sendCode(): void {
    const email = this.email.getValue() as string
    const result = this.authService.sendResetRequest(email)
    result.subscribe((response: { data: { message: string } }) => {
      this.nav.setRoot('NewPasswordPage')
    })
  }

  public goLogin(): void {
    this.nav.setRoot('LoginPage')
  }

  set emailModel(value: string) {
    this.email.next(value)
  }

  get emailModel(): string {
    const email = this.email.getValue() as string
    return email
  }

  get validEmail(): boolean {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const email = this.email.getValue() as string
    return reg.test(email)
  }
}
