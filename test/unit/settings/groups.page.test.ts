import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import {
  AlertController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { GroupsPageObject } from './groups.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { UsersService } from '../../../src/app/crm/users.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { Group } from '../../../src/app/settings/group.model'
import * as API from '../../../src/app/settings/groups.api.model'
import { GroupsPage } from '../../../src/app/settings/groups.page'
import { GroupsPageModule } from '../../../src/app/settings/groups.page.module'
import { GroupsService } from '../../../src/app/settings/groups.service'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'

describe('GroupsPage', () => {
  let fixture: ComponentFixture<GroupsPage>
  let page: GroupsPageObject
  let groups: Group[]
  let groupsServiceStub: any
  let usersServiceStub: any
  let groupUsers: User[]
  let userLists: User[]
  let toastControllerStub: any
  let toastStub: any
  let alertStub: any
  let alertControllerStub: any

  beforeEach(
    async(() => {
      groups = [{ id: 1, name: 'Group1' }, { id: 2, name: 'Group2' }]

      groupUsers = [
        new User({
          avatar_url: null,
          email: 'john@example.com',
          id: 11,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: null,
          email: 'mark@example.com',
          id: 12,
          name: 'Mark Boon',
          password: '',
          phone_number: '',
          role: 'sales_rep'
        })
      ]

      userLists = [
        new User({
          avatar_url: null,
          email: 'john@example.com',
          id: 11,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: null,
          email: 'mark@example.com',
          id: 12,
          name: 'Mark Boon',
          password: '',
          phone_number: '',
          role: 'sales_rep'
        }),
        new User({
          avatar_url: null,
          email: 'alekxis@example.com',
          id: 13,
          name: 'Alekxis Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: null,
          email: 'petr@example.com',
          id: 14,
          name: 'Petr Boon',
          password: '',
          phone_number: '',
          role: 'sales_rep'
        })
      ]

      groupsServiceStub = {
        addUser: (groupId: number, userId: number) => {
          const newUser = userLists.find((u) => u.id === userId)
          if (newUser) {
            groupUsers.concat(newUser)
          }
          return Observable.of(groupUsers)
        },
        createGroup: (groupData: API.IGroupCreate) => {
          const newGroup = new Group({
            id: 3,
            name: groupData.name
          })
          groups.push(newGroup)
          return Observable.of(groups)
        },
        deleteUser: (groupId: number, userId: number) => {
          groupUsers = groupUsers.filter((g) => g.id !== userId)
          return Observable.of(groupUsers)
        },
        group: (id: number) => {
          const group = groups.find((g) => g.id === id)
          return Observable.of(group)
        },
        groupUsers: () => Observable.of(groupUsers),
        groups: () => Observable.of(groups),
        updateGroup: (id: number, groupData: API.IGroupUpdate) => {
          const group = groups.map((g) => g.id === id)
          if (group === undefined) {
            return Observable.of(undefined)
          } else {
            return Observable.of({
              ...group,
              ...groupData
            })
          }
        }
      }

      const navParamsStub = {
        get: (prop: string) => undefined
      }

      usersServiceStub = {
        users: () => Observable.of(userLists)
      }
      spyOn(groupsServiceStub, 'createGroup').and.callThrough()
      spyOn(groupsServiceStub, 'updateGroup').and.callThrough()
      spyOn(groupsServiceStub, 'deleteUser').and.callThrough()
      spyOn(groupsServiceStub, 'addUser').and.callThrough()

      const currentUserServiceStub = new CurrentUserServiceStub()
      toastStub = {
        present: () => {
          return
        }
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(toastStub, 'present').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()

      alertStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }

      alertControllerStub = {
        create: () => alertStub
      }

      spyOn(alertStub, 'present').and.callThrough()
      spyOn(alertControllerStub, 'create').and.callThrough()

      fixture = initComponent(GroupsPage, {
        imports: [GroupsPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavController, useValue: new NavControllerStub() },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavParams, useValue: navParamsStub },
          { provide: UsersService, useValue: usersServiceStub },
          { provide: GroupsService, useValue: groupsServiceStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: AlertController, useValue: alertControllerStub }
        ]
      })

      page = new GroupsPageObject(fixture)

      fixture.detectChanges()
    })
  )

  describe('listing groups', () => {
    it('shows a list of groups', () => {
      expect(page.header).toEqual('Sales Groups')
      expect(page.groups).toEqual(['Group1', 'Group2'])
    })

    it('shows the create group button', () => {
      expect(page.createGroupButtonVisible).toBe(true)
    })

    it('shows the new group form after clicking the create group button', () => {
      page.clickCreateGroupButton()
      fixture.detectChanges()

      expect(page.header).toEqual('new Sales Group') // it will be capitalized via CSS
      expect(page.groupNameInputVisible).toBe(true)
    })
  })

  describe('creating group form', () => {
    beforeEach(() => {
      page.clickCreateGroupButton()
      fixture.detectChanges()
    })

    it('creates a group and shows listing after clicking the save button', () => {
      page.setGroupName('NewGroup')
      fixture.detectChanges()
      page.clickCreateGroupButton()
      fixture.detectChanges()

      expect(groupsServiceStub.createGroup).toHaveBeenCalledWith({
        name: 'NewGroup'
      })
      expect(page.header).toEqual('Sales Groups')
      expect(page.groups).toEqual(['Group1', 'Group2', 'NewGroup'])
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Created new group successfully.'
      })
    })

    it('returns to the listing after clicking the back button', () => {
      page.clickBack()
      fixture.detectChanges()

      expect(page.header).toEqual('Sales Groups')
    })

    it('blocks the creation when the name is blank', () => {
      expect(page.createGroupButtonEnabled).toBe(false)

      page.setGroupName('NewGroup')
      fixture.detectChanges()

      expect(page.createGroupButtonEnabled).toBe(true)
    })
  })

  describe('editing group form', () => {
    beforeEach(() => {
      page.clickGroup('Group1')
      fixture.detectChanges()
    })

    it('shows users to select box', () => {
      expect(page.header).toEqual('edit Sales Group') // it will be capitalized via CSS
      expect(page.users).toEqual(['Alekxis Boon', 'Petr Boon'])
    })

    it('shows user list of group', () => {
      expect(page.groupUsers).toEqual(['John Boon', 'Mark Boon'])
    })

    it('updates a group', () => {
      page.setGroupName('UpdatedGroup')
      fixture.detectChanges()
      page.clickUpdateGroupButton()
      fixture.detectChanges()

      expect(groupsServiceStub.updateGroup).toHaveBeenCalledWith(1, {
        name: 'UpdatedGroup'
      })
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Updated group name successfully.'
      })
    })

    it('add a group user', () => {
      page.addEvent(14)
      fixture.detectChanges()
      expect(groupsServiceStub.addUser).toHaveBeenCalledWith(1, '14')
      expect(page.groupUsers.length).toEqual(3)
      expect(page.groupUsers).toEqual(['John Boon', 'Mark Boon', 'Petr Boon'])
      expect(page.users).toEqual(['Alekxis Boon'])
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Added user successfully.'
      })
    })

    it('delete a group user', () => {
      page.deleteEvent(2)
      fixture.detectChanges()
      expect(alertControllerStub.create).toHaveBeenCalled()
    })
  })
})
