import { async, ComponentFixture } from '@angular/core/testing'
import { Observable } from 'rxjs'

import { ToastController } from 'ionic-angular'
import { Lead } from '../../../src/app/crm/lead.model'
import { Note } from '../../../src/app/crm/note.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { Deal } from '../../../src/app/deals/deal.model'
import { ShowTabsComponentsModule } from '../../../src/app/show-tabs/show-tabs.components.module'
import { TabNotesComponent } from '../../../src/app/show-tabs/tab-notes.component'
import { TabService } from '../../../src/app/show-tabs/tab.service'
import { toastSuccessDefaults } from '../../../src/app/utils/toast'
import { sampleDeal, sampleLead, sampleNote } from '../../support/factories'
import { initComponent } from '../../support/helpers'
import { TabNotesComponentObject } from './tab-notes.component.po'

describe('TabNotesComponent', () => {
  let fixture: ComponentFixture<TabNotesComponent>
  let component: TabNotesComponentObject
  let toastControllerStub: any
  let toastStub: any

  beforeEach(
    async(() => {
      const notes = [
        new Note(sampleNote({ content: 'First Note' })),
        new Note(sampleNote({ content: 'Second Note' })),
        new Note(sampleNote({ content: 'Last Note' }))
      ]
      const salesServiceStub = {
        createNote: () => Observable.of(new Note(sampleNote())),
        notes: () => Observable.of(notes)
      }
      const tabServiceStub = {
        getContact: () => Observable.of(new Lead(sampleLead())),
        getDeal: () => Observable.of(new Deal(sampleDeal())),
        setContact: () => null,
        setDeal: () => null
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
      spyOn(toastControllerStub, 'create').and.callThrough()

      fixture = initComponent(TabNotesComponent, {
        imports: [ShowTabsComponentsModule],
        providers: [
          { provide: SalesService, useValue: salesServiceStub },
          { provide: TabService, useValue: tabServiceStub },
          { provide: ToastController, useValue: toastControllerStub }
        ]
      })

      component = new TabNotesComponentObject(fixture)
      fixture.detectChanges()
    })
  )
  describe('table', () => {
    it('includes 3 leads', () => {
      expect(component.getNotes().length).toBe(3)
    })
    it('ordered by oldest at the top', () => {
      expect(component.getNotes()).toBeTruthy()
      expect(component.getNotes()[0]).toBe('First Note')
    })
  })

  describe('create note', () => {
    it('adds a new note', () => {
      component.setNote('Test Content')
      component.clickAddNote()
      fixture.detectChanges()
      expect(component.getNotes()).toBeTruthy()
      expect(component.getNotes().length).toBe(4)
      expect(component.getNotes()[3]).toBe('Test Content')
      expect(toastControllerStub.create).toHaveBeenCalledWith({
        ...toastSuccessDefaults,
        duration: 2000,
        message: 'Note Added'
      })
    })
  })
})
