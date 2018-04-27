import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavParams, ViewController } from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NewLeadPageObject } from './new-lead.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { FieldDefinition } from '../../../src/app/crm/field-definition.model'
import { NewLeadPage } from '../../../src/app/crm/new-lead.page'
import { NewLeadPageModule } from '../../../src/app/crm/new-lead.page.module'
import { SalesService } from '../../../src/app/crm/sales.service'
import { UsersService } from '../../../src/app/crm/users.service'

describe('NewLeadPage', () => {
  const stageId = 5

  let fixture: ComponentFixture<NewLeadPage>
  let page: NewLeadPageObject
  let users: ReadonlyArray<User>
  let currentUser: BehaviorSubject<User | undefined>
  let fields: ReadonlyArray<FieldDefinition>
  let leadCreate: Crm.API.ILeadCreate
  let salesServiceStub: any
  let viewControllerStub: any

  beforeEach(
    async(() => {
      users = [
        {
          avatar_url: null,
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          role: 'admin'
        },
        {
          avatar_url: null,
          email: 'mark@example.com',
          id: 101,
          name: 'Mark Boon',
          role: 'lead_owner'
        }
      ]

      currentUser = new BehaviorSubject<User | undefined>(users[0])

      fields = [
        { id: 300, name: 'First Name' },
        { id: 301, name: 'Last Name' },
        { id: 302, name: 'Website' }
      ]

      salesServiceStub = {
        createLead: (data: Crm.API.ILeadCreate) => {
          leadCreate = data
          return Observable.of({})
        },
        fields: () => Observable.of(fields)
      }

      spyOn(salesServiceStub, 'createLead').and.callThrough()

      const currentUserServiceStub = {
        details: currentUser
      }

      const usersServiceStub = {
        users: () => Observable.of(users)
      }

      viewControllerStub = {
        dismiss: () => {
          return
        }
      }

      spyOn(viewControllerStub, 'dismiss').and.callThrough()

      const navParamsStub = {
        get: (param: string) => (param === 'stageId' ? stageId : undefined)
      }

      fixture = initComponent(NewLeadPage, {
        imports: [NewLeadPageModule, HttpClientTestingModule],
        providers: [
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: UsersService, useValue: usersServiceStub },
          { provide: ViewController, useValue: viewControllerStub },
          { provide: NavParams, useValue: navParamsStub }
        ]
      })

      page = new NewLeadPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('contains inputs for base fields', () => {
    expect(page.baseFieldLabels).toEqual(['Email', 'Phone Number', 'Owner'])
  })

  it('contains inputs for custom fields', () => {
    expect(page.customFieldLabels).toEqual([
      'First Name',
      'Last Name',
      'Website'
    ])
  })

  it('sets the current user as the lead owner', () => {
    expect(page.ownerFieldValue).toEqual(currentUser!.value!.id.toString())
  })

  it('does not allow to specify owners for non-admins', () => {
    expect(page.isOwnerFieldEnabled).toBe(true)

    currentUser.next(users[1])
    fixture.detectChanges()

    expect(page.isOwnerFieldEnabled).toBe(false)
  })

  it('creates a lead in the specified stage after clicking the create button', () => {
    page.setField('Email', 'john@example.com')
    page.setField('Phone Number', '100200300')
    page.setField('Owner', users[1].id)
    page.setField('First Name', 'John')
    page.setField('Last Name', 'Example')
    fixture.detectChanges()

    page.clickCreateButton()

    expect(salesServiceStub.createLead).toHaveBeenCalled()
    expect(leadCreate).toEqual({
      email: 'john@example.com',
      fields: [
        { id: fields[0].id, value: 'John' },
        { id: fields[1].id, value: 'Example' }
      ],
      owner_id: users[1].id,
      phone_number: '100200300',
      stage_id: stageId
    })
    expect(viewControllerStub.dismiss).toHaveBeenCalled()
  })

  it('blocks create when form is invalid', () => {
    page.setField('Phone Number', '100200300')
    fixture.detectChanges()
    expect(page.isCreateButtonEnabled).toBe(true)

    page.setField('Email', 'a')
    fixture.detectChanges()

    expect(page.isCreateButtonEnabled).toBe(false)
  })

  it('dismisses the form after clicking the cancel button', () => {
    page.clickCancelButton()

    expect(viewControllerStub.dismiss).toHaveBeenCalled()
  })
})
