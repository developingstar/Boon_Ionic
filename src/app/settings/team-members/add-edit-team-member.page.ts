import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { User } from '../../auth/user.model'
import {
  emailValidator,
  phoneNumberValidator
} from '../../utils/form-validators'
import { AlertService } from '../alert.service'
import { PhoneNumber } from './phone_number.model'
import { TeamMembersService } from './team-members.service'

@IonicPage()
@Component({
  selector: 'page-add-edit-team-member',
  templateUrl: 'add-edit-team-member.page.html'
})
export class AddEditTeamMemberPage implements OnInit {
  public readonly myForm: FormGroup
  public readonly phoneNumbers: Observable<ReadonlyArray<PhoneNumber>>
  public localUrl: string = ''
  public formData: FormData
  public originalMember: User
  public isChanged: boolean
  public isNameChanged: boolean
  public isPasswordChanged: boolean
  public isEmailChanged: boolean

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public teamMembersService: TeamMembersService,
    public changeDetector: ChangeDetectorRef,
    public alertService: AlertService
  ) {
    this.myForm = this.formBuilder.group({
      avatarUrl: new FormControl(),
      email: new FormControl('', emailValidator()),
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      password: new FormControl(),
      phoneNumber: new FormControl('', phoneNumberValidator()),
      role: new FormControl()
    })
    this.isChanged = false
    this.phoneNumbers = this.teamMembersService.getNumbers()
  }

  ngOnInit(): void {
    const teamMemberId = this.navParams.get('teamMemberId')
    if (teamMemberId) {
      this.teamMembersService
        .getTeamMember(teamMemberId)
        .subscribe((res: User) => {
          this.originalMember = new User({
            avatar_url: res.avatarUrl,
            email: res.email,
            id: res.id,
            name: res.name,
            password: res.password,
            phone_number: res.phoneNumber,
            role: res.role
          })
          this.myForm.setValue(res)
          this.localUrl = this.myForm.value.avatarUrl
        })
    }
  }

  ionViewCanLeave(): Promise<boolean> {
    if (this.isChanged)
      return this.alertService.showSaveConfirmDialog(
        this.handleYes,
        this.handleNo
      )
    else return Promise.resolve(true)
  }

  public nameChanged(newName: string): void {
    if (this.originalMember) {
      this.isNameChanged = this.originalMember.name !== newName ? true : false
    } else {
      if (newName !== '') this.isNameChanged = true
      else this.isNameChanged = false
    }
    this.isChanged =
      this.isNameChanged || this.isEmailChanged || this.isPasswordChanged
  }

  public emailChanged(newEmail: string): void {
    if (this.originalMember) {
      this.isEmailChanged =
        this.originalMember.email !== newEmail ? true : false
    } else {
      if (newEmail !== '') this.isEmailChanged = true
      else this.isEmailChanged = false
    }
    this.isChanged =
      this.isNameChanged || this.isEmailChanged || this.isPasswordChanged
  }

  public passwordChanged(newPassword: string): void {
    if (this.originalMember) {
      this.isPasswordChanged =
        this.originalMember.name !== newPassword ? true : false
    } else {
      if (newPassword !== '') this.isPasswordChanged = true
      else this.isPasswordChanged = false
    }
    this.isChanged =
      this.isNameChanged || this.isEmailChanged || this.isPasswordChanged
  }

  onFileChange(event: any): void {
    this.formData = new FormData()
    this.formData.append(
      'avatar',
      event.target.files[0],
      event.target.files[0].name
    )

    const reader = new FileReader()
    reader.onload = (readEvent: Event) => {
      this.localUrl = reader.result
    }
    reader.readAsDataURL(event.target.files[0])
  }

  saveTeamMember(): void {
    this.myForm.patchValue({ role: 'lead_owner' })

    if (this.myForm.value.id !== null) {
      this.teamMembersService
        .updateTeamMember(this.myForm.value)
        .subscribe((userRes: User) => {
          if (!userRes.avatarUrl) {
            this.uploadAvatar(userRes.id)
          }
        })
    } else {
      this.teamMembersService
        .addTeamMember(this.myForm.value)
        .subscribe((res: User) => {
          this.uploadAvatar(res.id)
        })
    }
  }

  uploadAvatar(userId: number): void {
    if (this.formData) {
      this.teamMembersService
        .addTeamMemberImage(userId, this.formData)
        .subscribe((imageRes: User) => {
          this.myForm.setValue(imageRes)
        })
    }
  }

  private handleYes(): boolean {
    return true
  }

  private handleNo(): boolean {
    return false
  }
}
