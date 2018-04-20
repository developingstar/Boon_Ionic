import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, ComponentFixture } from '@angular/core/testing'
import { NavController, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { initComponent } from '../../support/helpers'
import { NavControllerStub } from '../../support/stubs'
import { CustomFieldsPageObject } from './custom-fields.page.po'

import { FieldDefinition } from '../../../src/app/crm/field-definition.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { NavService } from '../../../src/app/nav/nav.service'
import { CustomFieldsPage } from '../../../src/app/settings/custom-fields.page'
import { CustomFieldsPageModule } from '../../../src/app/settings/custom-fields.page.module'

describe('CustomFieldsPage', () => {
  let fixture: ComponentFixture<CustomFieldsPage>
  let page: CustomFieldsPageObject
  let fields: FieldDefinition[]
  let salesServiceStub: any

  beforeEach(async(() => {
    fields = [{ id: 300, name: 'First Name' }, { id: 301, name: 'Last Name' }]

    salesServiceStub = {
      createField: (fieldCreate: Crm.API.IFieldDefinitionCreate) => {
        const field = new FieldDefinition({
          id: 302,
          name: fieldCreate.name
        })
        fields.push(field)
        return Observable.of(field)
      },
      fields: () => Observable.of(fields),
      updateField: (
        id: number,
        fieldUpdate: Crm.API.IFieldDefinitionUpdate
      ) => {
        const field = new FieldDefinition({
          id: id,
          name: fieldUpdate.name!
        })
        fields[0] = field
        return Observable.of(field)
      }
    }

    spyOn(salesServiceStub, 'createField').and.callThrough()
    spyOn(salesServiceStub, 'updateField').and.callThrough()

    const navParamsStub = {
      get: (prop: string) => undefined
    }

    fixture = initComponent(CustomFieldsPage, {
      imports: [CustomFieldsPageModule, HttpClientTestingModule],
      providers: [
        NavService,
        { provide: NavController, useValue: new NavControllerStub() },
        { provide: NavParams, useValue: navParamsStub },
        { provide: SalesService, useValue: salesServiceStub }
      ]
    })

    page = new CustomFieldsPageObject(fixture)

    fixture.detectChanges()
  }))

  describe('listing custom fields', () => {
    it('shows a list of custom fields', () => {
      expect(page.customFields).toEqual(['First Name', 'Last Name'])
    })

    it('shows the add field button', () => {
      expect(page.addFieldButtonVisible).toBe(true)
    })

    it('shows the new field form after clicking the add field button', () => {
      page.clickAddFieldButton()
      fixture.detectChanges()

      expect(page.header).toBe('Create Field')
    })

    it('shows the edit field form after clicking name of the custom field', () => {
      page.clickCustomField('First Name')
      fixture.detectChanges()

      expect(page.header).toBe('Edit Field')
    })
  })

  describe('creating custom field form', () => {
    beforeEach(() => {
      page.clickAddFieldButton()
      fixture.detectChanges()
    })

    it('shows the create field button', () => {
      expect(page.addFieldButtonVisible).toBe(false)
      expect(page.createFieldButtonVisible).toBe(true)
    })

    it('creates a field and shows listing after clicking the create button', () => {
      page.setName('New Field')
      fixture.detectChanges()
      page.clickCreateFieldButton()
      fixture.detectChanges()

      expect(salesServiceStub.createField).toHaveBeenCalledWith({
        name: 'New Field'
      })

      expect(page.header).toBe('Custom Fields')
      expect(page.customFields).toEqual([
        'First Name',
        'Last Name',
        'New Field'
      ])
    })

    it('returns to the listing after clicking the back button', () => {
      page.clickBack()
      fixture.detectChanges()

      expect(page.header).toBe('Custom Fields')
    })

    it('blocks the creation when the name is blank', () => {
      expect(page.createFieldButtonEnabled).toBe(false)

      page.setName('New Field')
      fixture.detectChanges()

      expect(page.createFieldButtonEnabled).toBe(true)
    })
  })

  describe('editing custom field form', () => {
    beforeEach(() => {
      page.clickCustomField('First Name')
      fixture.detectChanges()
    })

    it('shows the update field button', () => {
      expect(page.addFieldButtonVisible).toBe(false)
      expect(page.updateFieldButtonVisible).toBe(true)
    })

    it('updates the field and shows listing after clicking the update button', () => {
      page.setName('Updated Field')
      fixture.detectChanges()
      page.clickUpdateFieldButton()
      fixture.detectChanges()

      expect(salesServiceStub.updateField).toHaveBeenCalledWith(fields[0].id, {
        name: 'Updated Field'
      })

      expect(page.header).toBe('Custom Fields')
      expect(page.customFields).toEqual(['Updated Field', 'Last Name'])
    })

    it('returns to the listing after clicking the back button', () => {
      page.clickBack()
      fixture.detectChanges()

      expect(page.header).toBe('Custom Fields')
    })

    it('blocks the update when the name is blank', () => {
      expect(page.updateFieldButtonEnabled).toBe(true)

      page.setName('')
      fixture.detectChanges()

      expect(page.updateFieldButtonEnabled).toBe(false)
    })
  })
})
