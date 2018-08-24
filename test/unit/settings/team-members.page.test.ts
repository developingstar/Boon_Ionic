import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { TeamMembersPage } from '../../../src/app/settings/team-members/team-members.page'
import { TeamMembersPageModule } from '../../../src/app/settings/team-members/team-members.page.module'
import { TeamMembersService } from '../../../src/app/settings/team-members/team-members.service'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub } from '../../support/stubs'
import { TeamMembersPageObject } from './team-members.page.po'

describe('TeamMembersPage', () => {
  let fixture: ComponentFixture<TeamMembersPage>
  let page: TeamMembersPageObject
  let teamMembers: User[]
  let teamMemberServiceStub: any

  beforeEach(
    async(() => {
      teamMembers = [
        new User({
          avatar_url: '',
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: '',
          email: 'lucy@example.com',
          id: 101,
          name: 'Lucy Neil',
          password: '',
          phone_number: '',
          role: 'admin'
        })
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

      teamMemberServiceStub = {
        getTeamMembers: () => Observable.of(teamMembers)
      }

      const currentUserServiceStub = new CurrentUserServiceStub()

      fixture = initComponent(TeamMembersPage, {
        imports: [TeamMembersPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: TeamMembersService, useValue: teamMemberServiceStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub }
        ]
      })

      page = new TeamMembersPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('has the standard header', () => {
    expect(page.header).toEqual('Team Members')
  })

  it('settings button is active', () => {
    expect(page.settingsButton[0].disabled).toBe(false)
  })

  it('has two users', () => {
    expect(page.getTeamMembers.length).toEqual(2)
  })

  it('has the correct users', () => {
    expect(page.getUserNames[0]).toEqual('John Boon')
    expect(page.getUserNames[1]).toEqual('Lucy Neil')
  })
})
