import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, NavController, NavParams } from 'ionic-angular'

import { CurrentUserService } from '../../auth/current-user.service'
import { User } from '../../auth/user.model'
import { pageAccess } from '../../utils/app-access'
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
    public navCtrl: NavController,
    public navParams: NavParams,
    public teamMembersService: TeamMembersService,
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
}
