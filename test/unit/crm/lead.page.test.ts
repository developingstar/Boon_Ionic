import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { LeadPageObject } from './lead.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { FieldDefinition } from '../../../src/app/crm/field-definition.model'
import { Lead } from '../../../src/app/crm/lead.model'
import { LeadPage } from '../../../src/app/crm/lead.page'
import { LeadPageModule } from '../../../src/app/crm/lead.page.module'
import { Note } from '../../../src/app/crm/note.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { UsersService } from '../../../src/app/crm/users.service'
import { NavService } from '../../../src/app/nav/nav.service'

describe('LeadPage', () => {
  let fixture: ComponentFixture<LeadPage>
  let page: LeadPageObject
  let fields: ReadonlyArray<FieldDefinition>
  let stage: Stage
  let stages: ReadonlyArray<Stage>
  let notes: ReadonlyArray<Note>
  let lead: Lead
  let leadUpdate: Crm.API.ILeadUpdate
  let navControllerStub: any
  let users: ReadonlyArray<User>
  const userRole: BehaviorSubject<string> = new BehaviorSubject<string>('admin')

  beforeEach(
    async(() => {
      users = [
        {
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          role: 'admin'
        },
        {
          email: 'mark@example.com',
          id: 101,
          name: 'Mark Boon',
          role: 'lead_owner'
        }
      ]

      fields = [
        { id: 300, name: 'First Name' },
        { id: 301, name: 'Last Name' },
        { id: 302, name: 'Website' }
      ]

      stages = [
        {
          id: 10,
          name: 'Enrolling',
          pipeline_id: 504
        },
        {
          id: 14,
          name: 'Signing',
          pipeline_id: 504
        },
        {
          id: 15,
          name: 'Closing - Won',
          pipeline_id: 504
        }
      ]

      notes = [
        {
          content: 'note1',
          id: 1
        },
        {
          content: 'note2',
          id: 2
        }
      ]

      stage = stages[1]

      lead = new Lead({
        created_by_service_id: null,
        created_by_user_id: 101,
        email: 'lead@example.com',
        fields: [
          { id: 300, name: 'First Name', value: 'Mark' },
          { id: 301, name: 'Last Name', value: 'Williams' },
          { id: 302, name: 'Website', value: 'williams.com' }
        ],
        id: 1,
        owner: {
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          role: 'admin'
        },
        phone_number: '+999100200300',
        stage_id: stage.id
      })

      const salesServiceStub = {
        fields: () => Observable.of(fields),
        lead: (id: number) => Observable.of(lead),
        notes: (lead_id: number) => Observable.of(notes),
        stage: (id: number) => Observable.of(stage),
        stages: (pipeline_id: number) => Observable.of(stages),
        updateLead: (id: number, data: Crm.API.ILeadUpdate) => {
          leadUpdate = data
          return Observable.of({
            ...lead,
            ...leadUpdate,
            owner: leadUpdate.owner_id
              ? users.find((user) => user.id === leadUpdate.owner_id)
              : null
          })
        }
      }

      const currentUserServiceStub = {
        details: Observable.of(users[0]),
        role: () => userRole
      }

      const usersServiceStub = {
        users: () => Observable.of(users)
      }

      const navParamsStub = {
        get: (prop: string) => lead.id
      }

      navControllerStub = new NavControllerStub()

      spyOn(navControllerStub, 'setRoot').and.callThrough()

      fixture = initComponent(LeadPage, {
        imports: [LeadPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: UsersService, useValue: usersServiceStub }
        ]
      })

      page = new LeadPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('returns to the CRM page after clicking back', () => {
    page.clickBackButton()

    expect(navControllerStub.setRoot).toHaveBeenCalledWith('CrmPage')
  })

  describe('showing lead', () => {
    it('includes name', () => {
      expect(page.leadName).toEqual(lead.name)
    })

    it('includes base fields', () => {
      expect(page.baseFieldValues).toEqual([
        lead.email!,
        lead.phone_number!,
        lead.owner!.id.toString()
      ])
    })

    it('includes custom fields', () => {
      expect(page.customFieldLabels).toEqual(
        lead.fields.map((field) => field.name)
      )
      expect(page.customFieldValues).toEqual(
        lead.fields.map((field) => field.value)
      )
    })

    it('shows the edit button', () => {
      expect(page.buttons).toEqual(['Edit'])
    })

    it('switches to edit mode after clicking the edit button', () => {
      expect(page.isEditMode).toBe(false)

      page.clickEditButton()

      fixture.detectChanges()
      expect(page.isEditMode).toBe(true)
    })

    it('shows the notes of lead', () => {
      expect(page.notes).toEqual(['note1', 'note2'])
    })

    it('add the notes to lead', () => {
      page.setNote('NewNote3')
      fixture.detectChanges()
    })
  })

  describe('editing lead', () => {
    beforeEach(() => {
      page.clickEditButton()
      fixture.detectChanges()
    })

    it('shows the cancel and save buttons', () => {
      expect(page.buttons).toEqual(['Cancel', 'Save'])
    })

    it('allows to cancel the changes', () => {
      page.emailField.setValue('test@example.com')
      page.clickCancelButton()

      fixture.detectChanges()

      expect(page.isEditMode).toBe(false)
      expect(page.emailField.value).toBe(lead.email!)
    })

    it('allows to save the changes', () => {
      // modify base field, dropdown field and a custom field
      page.emailField.setValue('test@example.com')
      page.ownerField.setValue(users[1].id)
      page.customFields[0].setValue('new value')

      page.clickSaveButton()
      fixture.detectChanges()

      expect(page.isEditMode).toBe(false)

      expect(leadUpdate.email).toBe('test@example.com')
      expect(leadUpdate.owner_id).toBe(users[1].id)
      expect(leadUpdate.fields).toContain({
        id: fields[0].id,
        value: 'new value'
      })

      expect(page.emailField.value).toBe('test@example.com')
      expect(page.ownerField.value).toBe(users[1].id.toString())
      expect(page.customFields[0].value).toBe('new value')
    })

    it('blocks edit of owner for non-admins', () => {
      userRole.next('lead_owner')
      fixture.detectChanges()

      expect(page.ownerField.isEnabled).toBe(false)
    })

    it('blocks save when data is not valid', () => {
      expect(page.isSaveButtonEnabled).toBe(true)

      page.emailField.setValue('invalid')
      fixture.detectChanges()

      expect(page.isSaveButtonEnabled).toBe(false)
    })
  })
})
