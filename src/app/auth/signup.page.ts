import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, NavController, ToastController } from 'ionic-angular'
import {
  emailValidator,
  matchOtherValidator,
  phoneNumberValidator
} from '../../../src/app/utils/form-validators'
import { showToast } from '../utils/toast'
import { AuthService } from './auth.service'
@IonicPage({
  segment: 'signup'
})
@Component({
  selector: 'signup-page',
  templateUrl: 'signup.page.html'
})
export class SignupPage {
  public signupForm: FormGroup

  constructor(
    private readonly authService: AuthService,
    private readonly nav: NavController,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.signupForm = this.formBuilder.group({
      email: new FormControl('', emailValidator()),
      name: new FormControl('', Validators.required),
      organization: new FormControl(''),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', [
        Validators.required,
        matchOtherValidator('password')
      ]),
      phoneNumber: new FormControl('', phoneNumberValidator())
    })
  }

  ngOnInit(): void {
    return
  }

  signup(): void {
    const user = this.signupForm.value
    this.authService.createOrganization(user).subscribe((res) => {
      if (res)
        showToast(this.toastController, 'You have successfully signed up!')
    })
    this.nav.setRoot('CrmPage')
  }

  goToLogin(): void {
    this.nav.setRoot('LoginPage')
  }
}
