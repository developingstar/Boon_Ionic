import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, ToastController } from 'ionic-angular'
import { BehaviorSubject } from 'rxjs'

import { showToast } from '../utils/toast'
import { AuthService } from './auth.service'

@IonicPage({
  segment: 'newpassword'
})
@Component({
  selector: 'new-password-page',
  templateUrl: 'new.password.page.html'
})
export class NewPasswordPage implements OnInit {
  public readonly newPassword: BehaviorSubject<string> = new BehaviorSubject('')
  public readonly confirmPassword: BehaviorSubject<
    string
  > = new BehaviorSubject('')
  public readonly code: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(
    private readonly authService: AuthService,
    private readonly nav: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    return
  }

  public createNewPassword(): void {
    const code = this.code.getValue() as string
    const newPassword = this.newPassword.getValue() as string
    const confirmPassword = this.confirmPassword.getValue() as string
    if (newPassword === confirmPassword) {
      const result = this.authService.createNewPassword(code, newPassword)
      result.subscribe(
        (response: { data: { message: string } }) => {
          this.nav.setRoot('LoginPage')
        },
        (error: any) => {
          if (error.status === 422) {
            showToast(
              this.toastController,
              'Invalid or expired token',
              2000,
              false
            )
          }
        }
      )
    } else {
      showToast(this.toastController, 'Password is invalid.', 2000, false)
    }
  }

  set codeModel(value: string) {
    this.code.next(value)
  }

  set newPasswordModel(value: string) {
    this.newPassword.next(value)
  }

  set confirmPasswordModel(value: string) {
    this.confirmPassword.next(value)
  }

  public goLogin(): void {
    this.nav.setRoot('LoginPage')
  }
}
