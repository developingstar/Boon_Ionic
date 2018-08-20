import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavParams, ToastController, ViewController } from 'ionic-angular'
import { BehaviorSubject, Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NewContactPageObject } from './new-contact.page.po'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { FieldDefinition } from '../../../src/app/crm/field-definition.model'
import { NewContactPage } from '../../../src/app/crm/new-contact.page'
import { NewContactPageModule } from '../../../src/app/crm/new-contact.page.module'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Stage } from '../../../src/app/crm/stage.model'
import { UsersService } from '../../../src/app/crm/users.service'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'
import { samplePipeline, sampleStage } from '../../support/factories'

describe('NewContactPage', () => {
  const stageId = 5
  let fixture: ComponentFixture<NewContactPage>
  let page: NewContactPageObject
  let users: User[]
  let currentUser: BehaviorSubject<User | undefined>
  let fields: FieldDefinition[]
  let stages: Stage[]
  let stages2: Stage[]
  let contactCreate: Crm.API.IContactCreate
  let pipelines: Pipeline[]
  let salesServiceStub: any
  let viewControllerStub: any
  let toastControllerStub: any
  let toastStub: any
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
      pipelines = [
        new Pipeline(
          samplePipeline({ id: 1, name: 'Converted', stage_order: [1, 2, 3] })
        ),
        new Pipeline(
          samplePipeline({
            id: 2,
            name: 'Without response',
            stage_order: [4, 5, 6]
          })
        )
      ]
      stages = [
        sampleStage({ id: 1, name: 'Stage One', pipeline_id: 1 }),
        sampleStage({ id: 2, name: 'Stage Two', pipeline_id: 1 }),
        sampleStage({ id: 3, name: 'Stage Three', pipeline_id: 1 })
      ]
      stages2 = [
        sampleStage({ id: 4, name: 'Stage Four', pipeline_id: 2 }),
        sampleStage({ id: 5, name: 'Stage Five', pipeline_id: 2 }),
        sampleStage({ id: 6, name: 'Stage Six', pipeline_id: 2 })
      ]
      currentUser = new BehaviorSubject<User | undefined>(users[0])
      fields = [{ id: 302, name: 'Website' }]
      salesServiceStub = {
        createContact: (data: Crm.API.IContactCreate) => {
          contactCreate = data
          return Observable.of({})
        },
        fields: () => Observable.of(fields),
        pipelines: () => {
          return Observable.of(pipelines)
        },
        stages: (data: number | string) => {
          if (data === 1 || data === '1') {
            return Observable.of(stages)
          } else {
            return Observable.of(stages2)
          }
        }
      }
      spyOn(salesServiceStub, 'createContact').and.callThrough()
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
      spyOn(viewControllerStub, 'dismiss').and.callThrough()
      spyOn(toastControllerStub, 'create').and.callThrough()
      const navParamsStub = {
        get: (param: string) => (param === 'stageId' ? stageId : undefined)
      }
      fixture = initComponent(NewContactPage, {
        imports: [NewContactPageModule, HttpClientTestingModule],
        providers: [
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: UsersService, useValue: usersServiceStub },
          { provide: ViewController, useValue: viewControllerStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: NavParams, useValue: navParamsStub }
        ]
      })
      page = new NewContactPageObject(fixture)
      fixture.detectChanges()
    })
  )

  it('contains inputs for base fields', () => {
    expect(page.baseFieldLabels).toEqual([
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Owner',
      'Pipeline',
      'Stage'
    ])
  })
  it('contains inputs for custom fields', () => {
    expect(page.customFieldLabels).toEqual(['Website'])
  })
  it('sets pipelines value as the first pipeline', () => {
    expect(page.pipelineFieldValue).toEqual(pipelines[0].id.toString())
  })
  it('gets new stages based on pipeline id and selects first stages option', () => {
    expect(page.stageFieldValue).toEqual(stages[0].id.toString())
  })
  it('gets new stages and selects first stages option when pipelines change', () => {
    page.selectPipeline(2)
    fixture.detectChanges()
    expect(page.stageFieldValue).toEqual(stages2[0].id.toString())
  })
  it('sets the current user as the contact owner', () => {
    expect(page.ownerFieldValue).toEqual(currentUser!.value!.id.toString())
  })
  it('does not allow to specify owners for non-admins', () => {
    expect(page.isOwnerFieldEnabled).toBe(true)
    currentUser.next(users[1])
    fixture.detectChanges()
    expect(page.isOwnerFieldEnabled).toBe(false)
  })
  it('creates a contact in the specified stage after clicking the create button', () => {
    page.setField('First Name', 'John')
    page.setField('Last Name', 'Example')
    page.setField('Email', 'john@example.com')
    page.setField('Phone Number', '100200300')
    page.setField('Owner', users[1].id)
    page.setField('Pipeline', pipelines[0].id)
    page.setField('Stage', stages[0].id)
    fixture.detectChanges()
    page.clickCreateButton()
    expect(toastControllerStub.create).toHaveBeenCalledWith({
      ...toastSuccessDefaults,
      duration: 2000,
      message: 'Contact created successfully.'
    })
    expect(salesServiceStub.createContact).toHaveBeenCalled()
    expect(contactCreate).toEqual({
      email: 'john@example.com',
      fields: [],
      first_name: 'John',
      last_name: 'Example',
      owner_id: users[1].id,
      phone_number: '100200300',
      pipeline_id: pipelines[0].id,
      stage_id: stages[0].id
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
