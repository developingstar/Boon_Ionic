import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import {
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { ContactPageObject } from './contact.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Contact } from '../../../src/app/crm/contact.model'
import { ContactPage } from '../../../src/app/crm/contact.page'
import { ContactPageModule } from '../../../src/app/crm/contact.page.module'
import { FieldDefinition } from '../../../src/app/crm/field-definition.model'
import { Note } from '../../../src/app/crm/note.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { UsersService } from '../../../src/app/crm/users.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>
  let page: ContactPageObject
  let fields: ReadonlyArray<FieldDefinition>
  let stage: Stage
  let stages: ReadonlyArray<Stage>
  let notes: Note[]
  let contact: Contact
  let contactUpdate: Crm.API.IContactUpdate
  let navControllerStub: any
  let modalControllerStub: any
  let modalStub: any
  let popoverControllerStub: any
  let popoverStub: any
  let users: ReadonlyArray<User>
  let toastControllerStub: any
  let toastStub: any
  const userRole: BehaviorSubject<string> = new BehaviorSubject<string>('admin')

  beforeEach(
    async(() => {
      users = [
        new User({
          avatar_url: null,
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: null,
          email: 'mark@example.com',
          id: 101,
          name: 'Mark Boon',
          password: '',
          phone_number: '',
          role: 'sales_rep'
        })
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
          pipelineId: 504
        },
        {
          id: 14,
          name: 'Signing',
          pipelineId: 504
        },
        {
          id: 15,
          name: 'Closing - Won',
          pipelineId: 504
        }
      ]

      notes = [
        {
          content: 'note1',
          date: '2017-12-01T07:00:00.000Z',
          id: 1
        },
        {
          content: 'note2',
          date: '2017-12-01T07:00:00.000Z',
          id: 2
        }
      ]

      stage = stages[1]

      contact = new Contact({
        created_by_service_id: null,
        created_by_user_id: 101,
        email: 'contact@example.com',
        fields: [
          { id: 300, name: 'First Name', value: 'Mark' },
          { id: 301, name: 'Last Name', value: 'Williams' },
          { id: 302, name: 'Website', value: 'williams.com' }
        ],
        first_name: 'Mark',
        id: 1,
        inserted_at: '2017-12-01T07:00:00.000Z',
        last_name: 'Williams',
        owner: {
          avatar_url: '',
          email: 'john@example.com',
          id: 100,
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        },
        phone_number: '+999100200300',
        stage_id: stage.id,
        updated_at: '2017-12-01T07:00:00.000Z'
      })

      const salesServiceStub = {
        contact: (id: number) => Observable.of(contact),
        createNote: (contactId: number, noteData: Crm.API.INoteCreate) => {
          const newNote = new Note({
            content: noteData.content,
            id: 3,
            inserted_at: '2017-12-01T07:00:00.000Z'
          })
          return Observable.of(newNote)
        },
        fields: () => Observable.of(fields),
        notes: (contactId: number) => Observable.of(notes),
        stage: (id: number) => Observable.of(stage),
        stages: (pipelineId: number) => Observable.of(stages),
        updateContact: (id: number, data: Crm.API.IContactUpdate) => {
          contactUpdate = data
          return Observable.of({
            ...contact,
            stageId: contactUpdate.stage_id,
            ...contactUpdate,
            owner: contactUpdate.owner_id
              ? users.find((user) => user.id === contactUpdate.owner_id)
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
        get: (prop: string) => contact.id
      }

      navControllerStub = new NavControllerStub()

      spyOn(navControllerStub, 'pop').and.callThrough()

      modalStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }
      popoverStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }
      toastStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }
      modalControllerStub = {
        create: () => modalStub
      }
      popoverControllerStub = {
        create: () => popoverStub
      }
      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(modalStub, 'present').and.callThrough()
      spyOn(modalControllerStub, 'create').and.callThrough()
      spyOn(popoverStub, 'present').and.callThrough()
      spyOn(popoverControllerStub, 'create').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()

      fixture = initComponent(ContactPage, {
        imports: [ContactPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: ModalController, useValue: modalControllerStub },
          { provide: PopoverController, useValue: popoverControllerStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: UsersService, useValue: usersServiceStub }
        ]
      })

      page = new ContactPageObject(fixture)

      fixture.detectChanges()
    })
  )

  it('returns to the CRM page after clicking back', () => {
    page.clickBackButton()

    expect(navControllerStub.pop).toHaveBeenCalled()
  })

  describe('showing contact', () => {
    it('includes name', () => {
      expect(page.contactName).toEqual(contact.name)
    })

    it('includes base fields', () => {
      expect(page.baseFieldValues).toEqual([
        contact.firstName!,
        contact.lastName!,
        contact.email!,
        contact.phoneNumber!,
        contact.owner!.id.toString()
      ])
    })

    it('includes date fields', () => {
      expect(page.dateFieldValue).toEqual([
        '12/01/17 07:00:00 AM',
        '12/01/17 07:00:00 AM'
      ])
    })

    it('includes custom fields', () => {
      expect(page.customFieldLabels).toEqual(
        contact.fields.map((field) => field.name)
      )
      expect(page.customFieldValues).toEqual(
        contact.fields.map((field) => field.value)
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

    it('shows the notes of contact', () => {
      expect(page.notes).toEqual(['note1', 'note2'])
    })

    it('check to add empty note to contact', () => {
      page.setNote('')
      page.clickAddNote()
      fixture.detectChanges()
      expect(page.notes).toEqual(['note1', 'note2'])
    })

    it('add the note to contact', () => {
      page.setNote('NewNote3')
      page.clickAddNote()
      fixture.detectChanges()
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Note added.'
      })
      expect(page.notes).toEqual(['note1', 'note2', 'NewNote3'])
    })
  })

  describe('editing contact', () => {
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
      expect(page.emailField.value).toBe(contact.email!)
    })

    it('allows to save the changes', () => {
      // modify base field, dropdown field and a custom field
      page.emailField.setValue('test@example.com')
      page.ownerField.setValue(users[1].id)
      page.customFields[0].setValue('new value')

      page.clickSaveButton()
      fixture.detectChanges()
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Updated contact successfully.'
      })
      expect(page.isEditMode).toBe(false)

      expect(contactUpdate.email).toBe('test@example.com')
      expect(contactUpdate.owner_id).toBe(users[1].id)
      expect(contactUpdate.fields).toContain({
        id: fields[0].id,
        value: 'new value'
      })

      expect(page.emailField.value).toBe('test@example.com')
      expect(page.ownerField.value).toBe(users[1].id.toString())
      expect(page.customFields[0].value).toBe('new value')
    })

    it('blocks edit of owner for non-admins', () => {
      userRole.next('sales_rep')
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
  describe('selecting and updating stage', () => {
    it('shows update stage button', () => {
      expect(page.updateStageBtn.nativeElement.firstChild!.textContent).toEqual(
        'Update stage'
      )
    })
    it('update stage button is disabled until stage is changed by user', () => {
      expect(page.updateStageBtn.nativeElement.disabled).toBeTruthy()
    })
    it('enables update stage button when user selects different stage', () => {
      page.selectStage(1)
      expect(page.updateStageBtn.nativeElement.disabled).toBeFalsy()
    })
    it('updates stage after clicking update stage button', () => {
      page.selectStage(3)
      page.clickUpdateStage()
      expect(fixture.componentInstance.currentStageId).toEqual(
        fixture.componentInstance.newStageId
      )
      expect(page.updateStageBtn.nativeElement.disabled).toBeTruthy()
    })
  })
  describe('More Button', () => {
    it('opens popover when more button is clicked', () => {
      page.openPopover()
      expect(popoverControllerStub.create).toHaveBeenCalledWith(
        'PopoverPage',
        { instanceName: 'contactMore' },
        { cssClass: 'boon-popover' }
      )
      expect(popoverStub.present).toHaveBeenCalled()
    })
    it('opens change pipeline modal', () => {
      fixture.componentInstance.changePipelineModal()
      expect(modalControllerStub.create).toHaveBeenCalledWith(
        'AssignStageModalComponent',
        {
          action: { data: { stage_id: contact.stageId } },
          isPipeline: true
        },
        { cssClass: 'assign-stage-modal-component' }
      )
      expect(modalStub.present).toHaveBeenCalled()
    })
  })
})
