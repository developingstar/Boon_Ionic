import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { GroupsPageObject } from './groups.page.po'

import { User } from '../../../src/app/auth/user.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { Group } from '../../../src/app/settings/group.model'
import * as API from '../../../src/app/settings/groups.api.model'
import { GroupsPage } from '../../../src/app/settings/groups.page'
import { GroupsPageModule } from '../../../src/app/settings/groups.page.module'
import { GroupsService } from '../../../src/app/settings/groups.service'

describe('PipelinesPage', () => {
  let fixture: ComponentFixture<GroupsPage>
  let page: GroupsPageObject
  let groups: Group[]
  let groupsServiceStub: any
  let groupUsers: User[]
  let userLists: User[]

  beforeEach(async(() => {
    groups = [{ id: 1, name: 'Group1' }, { id: 2, name: 'Group2' }]

    groupUsers = [
      {
        avatar_url: null,
        email: 'john@example.com',
        id: 11,
        name: 'John Boon',
        role: 'admin'
      },
      {
        avatar_url: null,
        email: 'mark@example.com',
        id: 12,
        name: 'Mark Boon',
        role: 'lead_owner'
      }
    ]

    userLists = [
      {
        avatar_url: null,
        email: 'john@example.com',
        id: 11,
        name: 'John Boon',
        role: 'admin'
      },
      {
        avatar_url: null,
        email: 'mark@example.com',
        id: 12,
        name: 'Mark Boon',
        role: 'lead_owner'
      },
      {
        avatar_url: null,
        email: 'alekxis@example.com',
        id: 13,
        name: 'Alekxis Novak',
        role: 'admin'
      },
      {
        avatar_url: null,
        email: 'petr@example.com',
        id: 14,
        name: 'Petr Nocolae',
        role: 'lead_owner'
      }
    ]

    groupsServiceStub = {
      createGroup: (groupData: API.IGroupCreate) => {
        const newGroup = new Group({
          id: 3,
          name: groupData.name
        })
        groups.push(newGroup)
        return Observable.of(groups)
      },
      group: (id: number) => {
        const group = groups.find((g) => g.id === id)
        return Observable.of(group)
      },
      groupUsers: () => Observable.of(groupUsers),
      groups: () => Observable.of(groups),
      updateGroup: (id: number, groupData: API.IGroupUpdate) => {
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i]
          if (group.id === id) {
            groups[i] = { ...group, name: groupData.name! }
            return Observable.of(group)
          }
        }
        return Observable.of(undefined)
      }
    }

    spyOn(groupsServiceStub, 'createGroup').and.callThrough()
    spyOn(groupsServiceStub, 'updateGroup').and.callThrough()

    fixture = initComponent(GroupsPage, {
      imports: [GroupsPageModule, HttpClientTestingModule],
      providers: [
        NavService,
        { provide: NavController, useValue: new NavControllerStub() },
        { provide: GroupsService, useValue: groupsServiceStub }
      ]
    })

    page = new GroupsPageObject(fixture)

    fixture.detectChanges()
  }))

  // describe('listing pipelines', () => {
  //   it('shows a list of pipelines', () => {
  //     expect(page.header).toEqual('Pipelines')
  //     expect(page.pipelines).toEqual(['New', 'Converted'])
  //   })

  //   it('shows the add pipeline button', () => {
  //     expect(page.addPipelineButtonVisible).toBe(true)
  //   })

  //   it('shows the new pipeline form after clicking the add pipeline button', () => {
  //     page.clickAddPipelineButton()
  //     fixture.detectChanges()

  //     expect(page.header).toEqual('new Pipeline') // it will be capitalized via CSS
  //   })
  // })

  // describe('creating pipeline form', () => {
  //   beforeEach(() => {
  //     page.clickAddPipelineButton()
  //     fixture.detectChanges()
  //   })

  //   it('creates a pipeline and shows listing after clicking the save button', () => {
  //     page.setName('Without Response')
  //     fixture.detectChanges()
  //     page.clickSavePipelineButton()
  //     fixture.detectChanges()

  //     expect(salesServiceStub.createPipeline).toHaveBeenCalledWith({
  //       name: 'Without Response'
  //     })
  //     expect(page.header).toEqual('Pipelines')
  //     expect(page.pipelines).toEqual(['New', 'Converted', 'Without Response'])
  //   })

  //   it('returns to the listing after clicking the back button', () => {
  //     page.clickBack()
  //     fixture.detectChanges()

  //     expect(page.header).toEqual('Pipelines')
  //   })

  //   it('blocks the creation when the name is blank', () => {
  //     expect(page.savePipelineButtonEnabled).toBe(false)

  //     page.setName('A New Pipeline')
  //     fixture.detectChanges()

  //     expect(page.savePipelineButtonEnabled).toBe(true)
  //   })
  // })

  // describe('editing pipeline form', () => {
  //   beforeEach(() => {
  //     page.clickPipeline('Converted')
  //     fixture.detectChanges()
  //   })

  //   it('updates a pipeline and shows listing after clicking the save button', () => {
  //     page.setName('Converted/Archived')
  //     fixture.detectChanges()
  //     page.clickSavePipelineButton()
  //     fixture.detectChanges()

  //     expect(salesServiceStub.updatePipeline).toHaveBeenCalledWith(102, {
  //       name: 'Converted/Archived',
  //       stage_order: []
  //     })
  //     expect(page.header).toEqual('Pipelines')
  //     expect(page.pipelines).toEqual(['New', 'Converted/Archived'])
  //   })
  // })
})
