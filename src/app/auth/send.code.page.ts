import { Component, OnInit } from '@angular/core'
import { IonicPage } from 'ionic-angular'
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
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    return
  }

  public sendCode(): void {
    const email = this.email.getValue() as string

    this.authService.sendCode(email)
  }

  set emailModel(value: string) {
    this.email.next(value)
  }
}
