import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { User } from '../../../src/app/auth/user.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { AddEditTeamMemberPage } from '../../../src/app/settings/team-members/add-edit-team-member.page'
import { AddEditTeamMemberPageModule } from '../../../src/app/settings/team-members/add-edit-team-member.page.module'
import { TeamMembersService } from '../../../src/app/settings/team-members/team-members.service'
import { initComponent } from '../../support/helpers'
import { AddTeamMembersPageObject } from './add-team-member.po'

describe('AddEditTeamMemberPage', () => {
  let fixture: ComponentFixture<AddEditTeamMemberPage>
  let page: AddTeamMembersPageObject
  const userId: string = '1'

  beforeEach(
    async(() => {
      const teamMember = {
        avatarUrl: 'test',
        email: 'john@example.com',
        id: 100,
        name: 'John Boon',
        password: '',
        phoneNumber: '',
        role: 'admin'
      }

      const phoneNumbers = [
        {
          phone_number: '312-231-4324'
        },
        {
          phone_number: '452-554-9031'
        }
      ]

      const navControllerStub = {
        push: () =>
          new Promise((resolve, reject) => {
            resolve({})
          })
      }

      const navParamsStub = {
        get: (prop: string) => userId
      }

      const teamMemberServiceStub = {
        addTeammember: (user: User) => Observable.of(teamMember),
        getNumbers: () => Observable.of(phoneNumbers),
        getTeamMember: (teamMemberId: string) => Observable.of(teamMember),
        updateTeamMember: (user: User) => Observable.of(teamMember)
      }

      fixture = initComponent(AddEditTeamMemberPage, {
        imports: [AddEditTeamMemberPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: TeamMembersService, useValue: teamMemberServiceStub },
          { provide: NavController, useValue: navControllerStub }
        ]
      })

      page = new AddTeamMembersPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('has the edit header', () => {
    expect(page.header).toEqual('Edit Team Member')
  })

  it('has the correct user loaded in', () => {
    expect(page.userName).toEqual('John Boon')
  })

  it('button is in edit state', () => {
    const buttonText = page.buttonText[0].textContent
    const buttonState = page.buttonState[0].disabled

    expect(buttonText).toEqual('update team member')
    expect(buttonState).toBe(false)
  })
})