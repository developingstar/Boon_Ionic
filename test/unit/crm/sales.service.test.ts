import { HttpParams } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { Contact } from '../../../src/app/crm/contact.model'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { sampleContact, samplePipeline } from '../../support/factories'
import { PaginatedCollection } from './../../../src/app/api/paginated-collection'
import { FieldDefinition } from './../../../src/app/crm/field-definition.model'

describe('SalesService', () => {
  let httpMock: HttpTestingController
  let service: SalesService
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [SalesService]
      })
      httpMock = TestBed.get(HttpTestingController)
      service = TestBed.get(SalesService)
    })
  )
  describe('contacts', () => {
    it(
      'returns an API collection',
      async(() => {
        const contact = sampleContact()
        service.contacts().subscribe((result: PaginatedCollection<Contact>) => {
          expect(result.count).toEqual(1)
          expect(result.nextPageLink).toEqual('http://example.com/next')
          expect(result.prevPageLink).toEqual('http://example.com/prev')
          expect(result.items[0]).toEqual(new Contact(contact))
          expect(result.items[0] instanceof Contact).toBeTruthy()
          expect(result.items.length).toEqual(1)
        })
        const req = httpMock.expectOne('/api/contacts?per_page=50')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            contacts: [JSON.parse(JSON.stringify(contact))]
          },
          links: {
            next: 'http://example.com/next',
            prev: 'http://example.com/prev'
          },
          metadata: {
            count: 1
          }
        })
        httpMock.verify()
      })
    )
    it(
      'allows to use a custom URL',
      async(() => {
        const url = 'http://example.com/api/contacts?cursor=10'
        const emptyParams = new HttpParams()
        service.contacts({ url: url, params: emptyParams }).subscribe()
        const req = httpMock.expectOne(url)
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            contacts: []
          },
          links: {
            next: null,
            prev: null
          },
          metadata: {
            count: 1
          }
        })
        httpMock.verify()
      })
    )
    it(
      'allows to use a custom params',
      async(() => {
        const emptyParams = new HttpParams()
        const params = emptyParams.set('pipeline_id', '1')
        service.contacts({ url: null, params: params }).subscribe()
        const req = httpMock.expectOne(
          '/api/contacts?per_page=50&pipeline_id=1'
        )
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            contacts: []
          },
          links: {
            next: null,
            prev: null
          },
          metadata: {
            count: 1
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('pipeline', () => {
    it(
      'returns a pipeline',
      async(() => {
        const convertedPipeline = samplePipeline({
          id: 1,
          name: 'Converted',
          stage_order: [1, 2, 3]
        })
        service.pipeline(1).subscribe((result: Pipeline) => {
          expect(result).toEqual(new Pipeline(convertedPipeline))
        })
        const req = httpMock.expectOne('/api/pipelines/1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            pipeline: JSON.parse(JSON.stringify(convertedPipeline))
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('pipelines', () => {
    it(
      'returns an array',
      async(() => {
        const convertedPipeline = samplePipeline({
          id: 1,
          name: 'Converted',
          stage_order: [1, 2, 3]
        })
        const withoutResponsePipeline = samplePipeline({
          id: 2,
          name: 'Without response',
          stageOrder: []
        })
        service.pipelines().subscribe((result: ReadonlyArray<Pipeline>) => {
          expect(result).toEqual([
            new Pipeline(convertedPipeline),
            new Pipeline(withoutResponsePipeline)
          ])
        })
        const req = httpMock.expectOne('/api/pipelines')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            pipelines: [
              JSON.parse(JSON.stringify(convertedPipeline)),
              JSON.parse(JSON.stringify(withoutResponsePipeline))
            ]
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('createPipeline', () => {
    it(
      'returns a new pipeline',
      async(() => {
        service.createPipeline({ name: 'Converted' }).subscribe((pipeline) => {
          expect(pipeline.id).toEqual(1)
          expect(pipeline.name).toEqual('Converted')
          expect(pipeline.stageOrder).toEqual([])
        })
        const req = httpMock.expectOne('/api/pipelines')
        expect(req.request.method).toBe('POST')
        req.flush({
          data: {
            pipeline: {
              id: 1,
              name: 'Converted',
              stage_order: []
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('updatePipeline', () => {
    it(
      'returns the updated pipeline',
      async(() => {
        service
          .updatePipeline(1, { stage_order: [1, 2, 3] })
          .subscribe((pipeline) => {
            expect(pipeline.id).toEqual(1)
            expect(pipeline.name).toEqual('Converted')
            expect(pipeline.stageOrder).toEqual([1, 2, 3])
          })
        const req = httpMock.expectOne('/api/pipelines/1')
        expect(req.request.method).toBe('PATCH')
        req.flush({
          data: {
            pipeline: {
              id: 1,
              name: 'Converted',
              stage_order: [1, 2, 3]
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('createStage', () => {
    it(
      'returns a new stage',
      async(() => {
        service
          .createStage(123, { name: 'Closed - Won' })
          .subscribe((stage) => {
            expect(stage.id).toEqual(1)
            expect(stage.pipelineId).toEqual(123)
            expect(stage.name).toEqual('Closed - Won')
          })
        const req = httpMock.expectOne('/api/pipelines/123/stages')
        expect(req.request.method).toBe('POST')
        req.flush({
          data: {
            stage: {
              id: 1,
              name: 'Closed - Won',
              pipeline_id: 123
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('updateStage', () => {
    it(
      'returns the updated stage',
      async(() => {
        service.updateStage(1, { name: 'Closed - Won' }).subscribe((stage) => {
          expect(stage.id).toEqual(1)
          expect(stage.pipelineId).toEqual(123)
          expect(stage.name).toEqual('Closed - Won')
        })
        const req = httpMock.expectOne('/api/stages/1')
        expect(req.request.method).toBe('PATCH')
        req.flush({
          data: {
            stage: {
              id: 1,
              name: 'Closed - Won',
              pipeline_id: 123
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('contact', () => {
    it(
      'returns a Contact',
      async(() => {
        service.contact(1).subscribe((contact) => {
          expect(contact.id).toEqual(1)
          expect(contact.email).toEqual('contact@example.com')
          expect(contact.phoneNumber).toEqual('+999100200300')
          expect(contact.stageId).toEqual(14)
          expect(contact.owner).not.toBeNull()
          expect(contact.owner!.id).toEqual(100)
          expect(contact.owner!.role).toEqual('sales_rep')
          expect(contact.owner!.name).toEqual('John Boon')
          expect(contact.owner!.email).toEqual('john@example.com')
          expect(contact.createdByUserId).toEqual(101)
          expect(contact.createdByServiceId).toBeNull()
          expect(Array.isArray(contact.fields)).toBeTruthy()
          expect(contact.fields[0].id).toBe(300)
          expect(contact.fields[0].name).toBe('website')
          expect(contact.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/contacts/1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            contact: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'contact@example.com',
              fields: [{ id: 300, name: 'website', value: 'example.com' }],
              id: 1,
              owner: {
                email: 'john@example.com',
                id: 100,
                name: 'John Boon',
                role: 'sales_rep'
              },
              phone_number: '+999100200300',
              stage_id: 14
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('createContact', () => {
    it(
      'returns a new contact',
      async(() => {
        service.createContact({}).subscribe((contact) => {
          expect(contact.id).toEqual(1)
          expect(contact.email).toEqual('contact@example.com')
          expect(contact.phoneNumber).toEqual('+999100200300')
          expect(contact.stageId).toEqual(14)
          expect(contact.owner).not.toBeNull()
          expect(contact.owner!.id).toEqual(100)
          expect(contact.owner!.role).toEqual('sales_rep')
          expect(contact.owner!.name).toEqual('John Boon')
          expect(contact.owner!.email).toEqual('john@example.com')
          expect(contact.createdByUserId).toEqual(101)
          expect(contact.createdByServiceId).toBeNull()
          expect(Array.isArray(contact.fields)).toBeTruthy()
          expect(contact.fields[0].id).toBe(300)
          expect(contact.fields[0].name).toBe('website')
          expect(contact.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/contacts')
        expect(req.request.method).toBe('POST')
        req.flush({
          data: {
            contact: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'contact@example.com',
              fields: [{ id: 300, name: 'website', value: 'example.com' }],
              id: 1,
              owner: {
                email: 'john@example.com',
                id: 100,
                name: 'John Boon',
                role: 'sales_rep'
              },
              phone_number: '+999100200300',
              stage_id: 14
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('updateContact', () => {
    it(
      'returns an updated contact',
      async(() => {
        service.updateContact(2, {}).subscribe((contact) => {
          expect(contact.id).toEqual(2)
          expect(contact.email).toEqual('contact@example.com')
          expect(contact.phoneNumber).toEqual('+999100200300')
          expect(contact.stageId).toEqual(14)
          expect(contact.owner).not.toBeNull()
          expect(contact.owner!.id).toEqual(100)
          expect(contact.owner!.role).toEqual('sales_rep')
          expect(contact.owner!.name).toEqual('John Boon')
          expect(contact.owner!.email).toEqual('john@example.com')
          expect(contact.createdByUserId).toEqual(101)
          expect(contact.createdByServiceId).toBeNull()
          expect(Array.isArray(contact.fields)).toBeTruthy()
          expect(contact.fields[0].id).toBe(300)
          expect(contact.fields[0].name).toBe('website')
          expect(contact.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/contacts/2')
        expect(req.request.method).toBe('PATCH')
        req.flush({
          data: {
            contact: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'contact@example.com',
              fields: [{ id: 300, name: 'website', value: 'example.com' }],
              id: 2,
              owner: {
                email: 'john@example.com',
                id: 100,
                name: 'John Boon',
                role: 'sales_rep'
              },
              phone_number: '+999100200300',
              stage_id: 14
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('stage', () => {
    it(
      'returns a Stage',
      async(() => {
        service.stage(1).subscribe((stage) => {
          expect(stage.id).toEqual(1)
          expect(stage.name).toEqual('Closed - Won')
          expect(stage.pipelineId).toEqual(102)
        })
        const req = httpMock.expectOne('/api/stages/1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            stage: {
              id: 1,
              name: 'Closed - Won',
              pipeline_id: 102
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('stages', () => {
    describe('when pipeline id is missing', () => {
      it(
        'returns all stages',
        async(() => {
          service.stages().subscribe((stages) => {
            expect(stages.length).toEqual(2)
            expect(stages[0].id).toEqual(11)
            expect(stages[0].name).toEqual('Signing')
            expect(stages[0].pipelineId).toEqual(1)
            expect(stages[1].id).toEqual(12)
            expect(stages[1].name).toEqual('Closed - Won')
            expect(stages[1].pipelineId).toEqual(2)
          })
          const req = httpMock.expectOne('/api/stages')
          expect(req.request.method).toBe('GET')
          req.flush({
            data: {
              stages: [
                {
                  id: 11,
                  name: 'Signing',
                  pipeline_id: 1
                },
                {
                  id: 12,
                  name: 'Closed - Won',
                  pipeline_id: 2
                }
              ]
            }
          })
          httpMock.verify()
        })
      )
    })
    describe('when pipeline id is given', () => {
      it(
        'returns stages in specified pipeline',
        async(() => {
          service.stages(103).subscribe((stages) => {
            expect(stages.length).toEqual(2)
            expect(stages[0].id).toEqual(11)
            expect(stages[0].name).toEqual('Signing')
            expect(stages[0].pipelineId).toEqual(103)
            expect(stages[1].id).toEqual(12)
            expect(stages[1].name).toEqual('Closed - Won')
            expect(stages[1].pipelineId).toEqual(103)
          })
          const req = httpMock.expectOne('/api/pipelines/103/stages')
          expect(req.request.method).toBe('GET')
          req.flush({
            data: {
              stages: [
                {
                  id: 11,
                  name: 'Signing',
                  pipeline_id: 103
                },
                {
                  id: 12,
                  name: 'Closed - Won',
                  pipeline_id: 103
                }
              ]
            }
          })
          httpMock.verify()
        })
      )
    })
  })
  describe('field', () => {
    it(
      'returns a field',
      async(() => {
        service.field(1).subscribe((field: FieldDefinition) => {
          expect(field.id).toEqual(1)
          expect(field.name).toEqual('First Name')
        })
        const req = httpMock.expectOne('/api/fields/1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            field: {
              id: 1,
              name: 'First Name'
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('fields', () => {
    it(
      'returns all fields',
      async(() => {
        service.fields().subscribe((fields) => {
          expect(fields.length).toEqual(2)
          expect(fields[0].id).toEqual(11)
          expect(fields[0].name).toEqual('First Name')
          expect(fields[1].id).toEqual(12)
          expect(fields[1].name).toEqual('Last Name')
        })
        const req = httpMock.expectOne('/api/fields')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            fields: [
              {
                id: 11,
                name: 'First Name'
              },
              {
                id: 12,
                name: 'Last Name'
              }
            ]
          }
        })
        httpMock.verify()
      })
    )
  })
})
