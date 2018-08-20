import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { AccountSettingsPage } from '../../../src/app/settings/account-settings/account-settings'
import { AccountSettingsPageModule } from '../../../src/app/settings/account-settings/account-settings.module'
import { TeamMembersService } from '../../../src/app/settings/team-members/team-members.service'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub } from '../../support/stubs'
import { AccountSettingsPageObject } from './account-settings.po'

describe('AccountSettingsPage', () => {
  let fixture: ComponentFixture<AccountSettingsPage>
  let page: AccountSettingsPageObject

  beforeEach(
    async(() => {
      const currentUser = {
        avatarUrl: 'test',
        email: 'john@example.com',
        id: 100,
        name: 'John Boon',
        password: '',
        phoneNumber: '',
        role: 'admin'
      }

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
        addTeammember: (user: User) => Observable.of(currentUser),
        updateTeamMember: (user: User) => Observable.of(currentUser)
      }

      localStorage.setItem('user', JSON.stringify(currentUser))
      const currentUserServiceStub = new CurrentUserServiceStub()

      fixture = initComponent(AccountSettingsPage, {
        imports: [AccountSettingsPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: TeamMembersService, useValue: teamMemberServiceStub },
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub }
        ]
      })

      page = new AccountSettingsPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('has the edit header', () => {
    expect(page.header).toEqual('Account Settings')
  })

  it('has the correct user loaded in', () => {
    expect(page.userName).toEqual('John Boon')
  })

  it('the button is enabled', () => {
    const buttonState = page.buttonState[0].disabled
    expect(buttonState).toBe(false)
  })
})
