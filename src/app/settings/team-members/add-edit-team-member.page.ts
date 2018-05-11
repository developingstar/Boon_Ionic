import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'
import { User } from '../../auth/user.model'
import {
  emailValidator,
  phoneNumberValidator
} from '../../utils/form-validators'
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public teamMembersService: TeamMembersService,
    public changeDetector: ChangeDetectorRef
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

    this.phoneNumbers = this.teamMembersService.getNumbers()
  }

  ngOnInit(): void {
    const teamMemberId = this.navParams.get('teamMemberId')
    if (teamMemberId) {
      this.teamMembersService
        .getTeamMember(teamMemberId)
        .subscribe((res: User) => {
          this.myForm.setValue(res)
          this.localUrl = this.myForm.value.avatarUrl
        })
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
}
