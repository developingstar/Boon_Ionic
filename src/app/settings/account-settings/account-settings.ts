import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'

import { CurrentUserService } from '../../auth/current-user.service'
import { User } from '../../auth/user.model'
import { pageAccess } from '../../utils/app-access'
import { showToast } from '../../utils/toast'
import { AlertService } from '../alert.service'
import { TeamMembersService } from '../team-members/team-members.service'

@IonicPage()
@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettingsPage implements OnInit {
  public readonly userForm: FormGroup
  public readonly passwordForm: FormGroup
  public localUrl: string = ''
  public formData: FormData

  constructor(
    public alertService: AlertService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public teamMembersService: TeamMembersService,
    private readonly toastController: ToastController,
    private formBuilder: FormBuilder,
    private currentUserService: CurrentUserService
  ) {
    this.userForm = this.formBuilder.group({
      company: new FormControl(''),
      email: new FormControl('', Validators.email),
      id: new FormControl(),
      name: new FormControl('', Validators.required)
    })

    this.passwordForm = this.formBuilder.group({
      current_password: new FormControl(),
      new_password: new FormControl(),
      password_repeat: new FormControl()
    })
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      this.setUserForm(user)
      this.localUrl = user.avatarUrl
        ? user.avatarUrl
        : '../../assets/icon/settings/avatar.svg'
    }
  }

  onFileChange(event: any): void {
    this.formData = new FormData()
    this.formData.append(
      'avatar',
      event.target.files[0],
      event.target.files[0].name
    )

    const reader = new FileReader()
    reader.onload = (readEvent: any) => {
      this.localUrl = reader.result
    }
    reader.readAsDataURL(event.target.files[0])
  }

  updateCurrentUser(): void {
    this.teamMembersService
      .updateTeamMember(this.userForm.value)
      .subscribe((res: User) => {
        this.uploadAvatar(res.id)
      })
    this.currentUserService.details.subscribe((details: any) => {
      if (details) {
        details.name = this.userForm.value.name
        details.email = this.userForm.value.email
        localStorage.setItem('user', JSON.stringify(details))
      }
    })
    showToast(this.toastController, 'User updated successfully', 2000)
  }

  resetPassword(): void {
    this.alertService
      .showRemoveConfirmDialog(
        'Password instructions will be sent to your email',
        this.handleYes,
        this.handleNo
      )
      .then((val: boolean) => {
        if (val === true) {
          this.teamMembersService
            .resetPasswordRequest(this.userForm.value.email)
            .subscribe((res: any) => {
              if (res.data.message === 'OK') {
                showToast(
                  this.toastController,
                  'Reset password instructions sent',
                  2000
                )
              }
            })
        }
      })
  }

  uploadAvatar(userId: number): void {
    if (this.formData) {
      this.teamMembersService
        .addTeamMemberImage(userId, this.formData)
        .subscribe((imageRes: User) => {
          this.setUserForm(imageRes)
          localStorage.setItem('user', JSON.stringify(imageRes))
        })
    }
  }

  setUserForm(user: User): void {
    this.userForm.patchValue({ name: user.name })
    this.userForm.patchValue({ email: user.email })
    this.userForm.patchValue({ id: user.id })
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).AccountSettingsPage !== undefined
  }

  private handleYes(): boolean {
    return true
  }

  private handleNo(): boolean {
    return false
  }
}
