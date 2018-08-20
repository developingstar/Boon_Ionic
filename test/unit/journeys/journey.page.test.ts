import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler
} from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import {
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable } from 'rxjs'
import { JourneyPageModule } from './../../../src/app/journeys/journey.page.module'

import { CurrentUserService } from '../../../src/app/auth/current-user.service'
import { User } from '../../../src/app/auth/user.model'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { UsersService } from '../../../src/app/crm/users.service'
import { JourneyPage } from '../../../src/app/journeys/journey.page'
import { JourneysService } from '../../../src/app/journeys/journeys.service'
import { EmailTemplate } from '../../../src/app/messages/email-template.model'
import { MessagesService } from '../../../src/app/messages/messages.service'
import { TextTemplate } from '../../../src/app/messages/text-template.model'
import { NavService } from '../../../src/app/nav/nav.service'
import { toastWarningDefaults } from '../../../src/app/utils/toast'
import {
  sampleEmailTemplate,
  sampleField,
  sampleJourney,
  samplePipeline,
  sampleStage,
  sampleTextTemplate,
  sampleUser
} from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { CurrentUserServiceStub, NavControllerStub } from '../../support/stubs'
import { Journey } from './../../../src/app/journeys/journey.model'
import { JourneyPageObject } from './journey.page.po'

describe('JourneyPage', () => {
  let fixture: ComponentFixture<JourneyPage>
  let journey: Journey
  let journeysServiceStub: JourneysService
  let modalControllerStub: any
  let modalStub: any
  let navControllerStub: any
  let navParamsStub: any
  let page: JourneyPageObject
  let toastControllerStub: any
  let toastStub: any

  beforeEach(
    async(() => {
      journey = new Journey(
        sampleJourney({
          actions: [
            {
              data: {
                owner_id: 2
              },
              id: 1,
              journey_id: 1,
              position: 1,
              type: 'assign_owner'
            },
            {
              data: {
                stage_id: 1
              },
              id: 2,
              journey_id: 1,
              position: 2,
              type: 'assign_stage'
            },
            {
              data: {
                send_from_owner: true,
                template_id: 1
              },
              id: 3,
              journey_id: 1,
              position: 3,
              type: 'send_email'
            },
            {
              data: {
                send_from_owner: false,
                template_id: 2
              },
              id: 4,
              journey_id: 1,
              position: 4,
              type: 'send_text'
            },
            {
              data: {
                field_id: 1,
                value: 'New'
              },
              id: 5,
              journey_id: 1,
              position: 5,
              type: 'update_field'
            },
            {
              data: {
                for: 3600
              },
              id: 6,
              journey_id: 1,
              position: 6,
              type: 'wait'
            }
          ],
          id: 1,
          name: 'Introduction',
          published_at: null,
          state: 'inactive',
          triggers: [
            {
              data: {
                field_id: 1,
                value: 'New'
              },
              id: 1,
              journey_id: 1,
              type: 'field_updated'
            },
            {
              data: {
                pipeline_id: 1
              },
              id: 2,
              journey_id: 1,
              type: 'pipeline_assigned'
            },
            {
              data: {
                stage_id: 1
              },
              id: 3,
              journey_id: 1,
              type: 'stage_assigned'
            }
          ]
        })
      )

      const httpClient = new HttpClient(
        new class extends HttpHandler {
          handle(req: any): Observable<any> {
            return Observable.never()
          }
        }()
      )

      journeysServiceStub = new JourneysService(httpClient)
      journeysServiceStub.journey = () => Observable.of(journey)
      spyOn(journeysServiceStub, 'journey').and.callThrough()
      journeysServiceStub.updateJourney = () => Observable.of(journey)

      const salesServiceStub = new SalesService(httpClient)
      salesServiceStub.pipeline = () =>
        Observable.of(
          new Pipeline(
            samplePipeline({
              id: 1,
              name: 'Potential clients'
            })
          )
        )
      salesServiceStub.stage = () =>
        Observable.of(
          sampleStage({
            id: 1,
            name: 'Converted'
          })
        )
      salesServiceStub.field = () =>
        Observable.of(
          sampleField({
            id: 1,
            name: 'Website'
          })
        )

      const usersServiceStub = new UsersService(httpClient)
      usersServiceStub.user = () =>
        Observable.of(
          new User(
            sampleUser({
              id: 2,
              name: 'Susan Boon'
            })
          )
        )

      const messagesServiceStub = new MessagesService(httpClient)
      messagesServiceStub.emailTemplate = () =>
        Observable.of(
          new EmailTemplate(
            sampleEmailTemplate({
              id: 1,
              name: 'Email Introduction'
            })
          )
        )
      messagesServiceStub.textTemplate = () =>
        Observable.of(
          new TextTemplate(
            sampleTextTemplate({
              id: 2,
              name: 'Text Introduction'
            })
          )
        )

      modalStub = {
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
      spyOn(modalStub, 'present').and.callThrough()
      spyOn(modalControllerStub, 'create').and.callThrough()

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

      navParamsStub = {
        get: () => journey.id.toString()
      }

      navControllerStub = new NavControllerStub({
        name: 'JourneyPage'
      })
      const currentUserServiceStub = new CurrentUserServiceStub()
      fixture = initComponent(JourneyPage, {
        imports: [JourneyPageModule, HttpClientTestingModule],
        providers: [
          NavService,
          { provide: JourneysService, useValue: journeysServiceStub },
          { provide: MessagesService, useValue: messagesServiceStub },
          { provide: ModalController, useValue: modalControllerStub },
          { provide: NavController, useValue: navControllerStub },
          { provide: CurrentUserService, useValue: currentUserServiceStub },
          { provide: NavParams, useValue: navParamsStub },
          { provide: SalesService, useValue: salesServiceStub },
          { provide: ToastController, useValue: toastControllerStub },
          { provide: UsersService, useValue: usersServiceStub }
        ]
      })

      page = new JourneyPageObject(fixture)
      fixture.detectChanges()
    })
  )

  describe('events sidebar', () => {
    describe('triggers', () => {
      it('includes all types', () => {
        const triggers = page.sidebarTriggers()

        expect(triggers.length).toEqual(3)
        expect(triggers[0].textContent).toEqual('field updated')
        expect(triggers[1].textContent).toEqual('pipeline assigned')
        expect(triggers[2].textContent).toEqual('stage assigned')
      })

      it('allows opening a modal for adding a field updated trigger', () => {
        page.openNewTriggerModal('field_updated')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'FieldUpdatedModalComponent',
          {},
          { cssClass: 'field-updated-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding a pipeline assigned trigger', () => {
        page.openNewTriggerModal('pipeline_assigned')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'PipelineAssignedModalComponent',
          {},
          { cssClass: 'pipeline-assigned-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding a stage assigned trigger', () => {
        page.openNewTriggerModal('stage_assigned')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'StageAssignedModalComponent',
          {},
          { cssClass: 'stage-assigned-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })
    })

    describe('actions', () => {
      it('includes all types', () => {
        const actions = page.sidebarActions()

        expect(actions.length).toEqual(6)
        expect(actions[0].textContent).toEqual('assign owner')
        expect(actions[1].textContent).toEqual('assign stage')
        expect(actions[2].textContent).toEqual('send email')
        expect(actions[3].textContent).toEqual('send text')
        expect(actions[4].textContent).toEqual('update field')
        expect(actions[5].textContent).toEqual('wait')
      })

      it('allows opening a modal for adding an assign owner action', () => {
        page.openNewActionModal('assign_owner')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'AssignOwnerModalComponent',
          {},
          { cssClass: 'assign-owner-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding an assign stage action', () => {
        page.openNewActionModal('assign_stage')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'AssignStageModalComponent',
          {},
          { cssClass: 'assign-stage-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding a send email action', () => {
        page.openNewActionModal('send_email')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'SendEmailModalComponent',
          {},
          { cssClass: 'send-email-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding a send text action', () => {
        page.openNewActionModal('send_text')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'SendTextModalComponent',
          {},
          { cssClass: 'send-text-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding an update field action', () => {
        page.openNewActionModal('update_field')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'UpdateFieldModalComponent',
          {},
          { cssClass: 'update-field-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows opening a modal for adding a wait action', () => {
        page.openNewActionModal('wait')

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'WaitModalComponent',
          {},
          { cssClass: 'wait-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })
    })
  })

  describe('events definition', () => {
    describe('triggers', () => {
      it('includes boxes for each defined event', () => {
        const triggers = page.contentTriggers()

        expect(triggers.length).toEqual(3)
        page.expectEventBoxInformation(triggers[0], 'field updated', 'Website')
        page.expectEventBoxInformation(
          triggers[1],
          'pipeline assigned',
          'Potential clients'
        )
        page.expectEventBoxInformation(
          triggers[2],
          'stage assigned',
          'Converted'
        )
      })

      it('allows opening a modal for editing an event', () => {
        page.openEditTriggerModal(1)

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'FieldUpdatedModalComponent',
          { trigger: journey.triggers[0] },
          { cssClass: 'field-updated-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows to delete a given trigger', () => {
        spyOn(journeysServiceStub, 'updateJourney').and.callThrough()

        page.deleteTrigger(1)

        expect(journeysServiceStub.updateJourney).toHaveBeenCalledWith(1, {
          journey: {
            triggers: [
              journey.toApiRepresentation().triggers[1],
              journey.toApiRepresentation().triggers[2]
            ]
          }
        })

        expect(modalControllerStub.create).toHaveBeenCalledTimes(0)
      })
    })

    describe('actions', () => {
      it('includes boxes for each defined event', () => {
        const actions = page.contentActions()

        expect(actions.length).toEqual(6)
        page.expectEventBoxInformation(actions[0], 'assign owner', 'Susan Boon')
        page.expectEventBoxInformation(actions[1], 'assign stage', 'Converted')
        page.expectEventBoxInformation(
          actions[2],
          'send email',
          'Email Introduction (contact owner)'
        )
        page.expectEventBoxInformation(
          actions[3],
          'send text',
          'Text Introduction'
        )
        page.expectEventBoxInformation(actions[4], 'update field', 'Website')
        page.expectEventBoxInformation(actions[5], 'wait', '1 hour(s)')
      })

      it('allows opening a modal for editing an event', () => {
        page.openEditActionModal(1)

        expect(modalControllerStub.create).toHaveBeenCalledWith(
          'AssignOwnerModalComponent',
          { action: journey.actions[0] },
          { cssClass: 'assign-owner-modal-component' }
        )
        expect(modalStub.present).toHaveBeenCalled()
      })

      it('allows to delete a given action', () => {
        spyOn(journeysServiceStub, 'updateJourney').and.callThrough()

        page.deleteAction(1)
        const iJourney = journey.toApiRepresentation()
        expect(journeysServiceStub.updateJourney).toHaveBeenCalledWith(1, {
          journey: {
            actions: [
              iJourney.actions[1],
              iJourney.actions[2],
              iJourney.actions[3],
              iJourney.actions[4],
              iJourney.actions[5]
            ]
          }
        })

        expect(modalControllerStub.create).toHaveBeenCalledTimes(0)
      })
    })

    describe('an uprocessable entity error on update', () => {
      it('displays an error message', () => {
        spyOn(journeysServiceStub, 'updateJourney').and.callFake(() => {
          return Observable.throw(new HttpErrorResponse({ status: 422 }))
        })

        page.deleteAction(1)

        expect(toastControllerStub.create).toHaveBeenCalledWith({
          ...toastWarningDefaults,
          duration: 2000,
          message: 'Failed to update the journey.'
        })
        expect(toastStub.present).toHaveBeenCalled()
      })
    })
  })
})
