import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { AddEditTeamMemberPage } from '../../../src/app/settings/team-members/add-edit-team-member.page'
import { AddEditTeamMemberPageModule } from '../../../src/app/settings/team-members/add-edit-team-member.page.module'
import { TeamMembersService } from '../../../src/app/settings/team-members/team-members.service'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub } from '../../support/stubs'
import { AddTeamMembersPageObject } from './add-team-member.po'

describe('AddEditTeamMemberPage', () => {
  let fixture: ComponentFixture<AddEditTeamMemberPage>
  let page: AddTeamMembersPageObject

  beforeEach(
    async(() => {
      const teamMember = {}

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
        get: (prop: string) => undefined
      }

      const teamMemberServiceStub = {
        addTeammember: (user: User) => Observable.of(teamMember),
        getNumbers: () => Observable.of(phoneNumbers),
        getTeamMember: (teamMemberId: string) => Observable.of(teamMember),
        updateTeamMember: (user: User) => Observable.of(teamMember)
      }
      const currentUserServiceStub = new CurrentUserServiceStub()

      fixture = initComponent(AddEditTeamMemberPage, {
        imports: [AddEditTeamMemberPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: TeamMembersService, useValue: teamMemberServiceStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub }
        ]
      })

      page = new AddTeamMembersPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('has the add header', () => {
    expect(page.header).toEqual('New Team Member')
  })

  it('no users are loaded in', () => {
    expect(page.userName).toEqual('')
  })

  it('button is in add state', () => {
    const buttonText = page.buttonText[0].textContent
    const buttonState = page.buttonState[0].disabled

    expect(buttonText).toEqual('add team member')
    expect(buttonState).toBe(false)
  })
})
