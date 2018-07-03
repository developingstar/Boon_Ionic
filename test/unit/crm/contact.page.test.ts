import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { BehaviorSubject, Observable, Subject } from 'rxjs'

import { ContactPageObject } from './contact.page.po'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { ContactShowPage } from '../../../src/app/crm/contact-show.page'
import { ContactShowPageModule } from '../../../src/app/crm/contact-show.page.module'
import { Lead } from '../../../src/app/crm/lead.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { UsersService } from '../../../src/app/crm/users.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { TabService } from '../../../src/app/show-tabs/tab.service'
// import { toastSuccessDefaults } from '../../../src/app/utils/toast'

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactShowPage>
  let page: ContactPageObject
  let contact: Lead
  // let leadUpdate: Crm.API.ILeadUpdate
  let navControllerStub: any
  let users: ReadonlyArray<User>
  let toastControllerStub: any
  let toastStub: any
  let contactSubject: Subject<Lead>
  const userRole: BehaviorSubject<string> = new BehaviorSubject<string>('admin')

  beforeEach(
    async(() => {
      users = [
        new User({
          avatar_url: null,
          email: 'john@example.com',
          first_name: 'John',
          id: 100,
          last_name: 'Boon',
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        }),
        new User({
          avatar_url: null,
          email: 'mark@example.com',
          first_name: 'Mark',
          id: 101,
          last_name: 'Boon',
          name: 'Mark Boon',
          password: '',
          phone_number: '',
          role: 'lead_owner'
        })
      ]

      contact = new Lead({
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
          first_name: 'John',
          id: 100,
          last_name: 'Boon',
          name: 'John Boon',
          password: '',
          phone_number: '',
          role: 'admin'
        },
        phone_number: '+999100200300',
        stage_id: 0,
        updated_at: '2017-12-01T07:00:00.000Z'
      })
      contactSubject = new Subject<Lead>()

      const salesServiceStub = {
        lead: (id: number) => Observable.of(contact)
      }

      const currentUserServiceStub = {
        details: Observable.of(users[0]),
        role: () => userRole
      }

      const usersServiceStub = {
        getTeamMembers: () => Observable.of(users)
      }

      const navParamsStub = {
        get: (prop: string) => contact.id
      }

      navControllerStub = new NavControllerStub()

      spyOn(navControllerStub, 'pop').and.callThrough()
      spyOn(navControllerStub, 'canGoBack').and.callThrough()
      spyOn(navControllerStub, 'setRoot').and.callThrough()

      toastStub = {
        onDidDismiss: () => {
          return
        },
        present: () => {
          return
        }
      }

      toastControllerStub = {
        create: () => toastStub
      }
      spyOn(toastControllerStub, 'create').and.callThrough()

      const tabServiceStub = {
        getContact: () => {
          return contactSubject
        },
        setContact: (con: Lead) => {
          contactSubject.next(con)
        }
      }

      fixture = initComponent(ContactShowPage, {
        imports: [ContactShowPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: NavParams, useValue: navParamsStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: UsersService, useValue: usersServiceStub },
          { provide: TabService, useValue: tabServiceStub }
        ]
      })

      page = new ContactPageObject(fixture)
      fixture.detectChanges()
    })
  )

  it('returns to the ContactIndex page after clicking back', () => {
    page.clickBackButton()
    expect(navControllerStub.pop).toHaveBeenCalled()
  })

  describe('showing contact', () => {
    it('includes name', () => {
      expect(page.contactName).toEqual(contact.name)
    })

    it('includes base fields', () => {
      expect(page.baseFieldValues).toEqual([
        contact.email!,
        contact.phoneNumber!,
        contact.owner!.name.toString()
      ])
    })

    it('shows the edit button', () => {
      expect(page.isButtonVisible('Edit')).toEqual(true)
    })

    it('switches to edit mode after clicking the edit button', () => {
      page.clickEditButton()
      fixture.detectChanges()

      const editValues = page.getEditVales()
      expect(editValues.length).toEqual(4)
    })
  })
})
