import { HttpParams } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { Lead } from '../../../src/app/crm/lead.model'
import { Pipeline } from '../../../src/app/crm/pipeline.model'
import { SalesService } from '../../../src/app/crm/sales.service'
import { sampleLead, samplePipeline } from '../../support/factories'
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
  describe('leads', () => {
    it(
      'returns an API collection',
      async(() => {
        const lead = sampleLead()
        service.leads().subscribe((result: PaginatedCollection<Lead>) => {
          expect(result.count).toEqual(1)
          expect(result.nextPageLink).toEqual('http://example.com/next')
          expect(result.prevPageLink).toEqual('http://example.com/prev')
          expect(result.items[0]).toEqual(new Lead(lead))
          expect(result.items[0] instanceof Lead).toBeTruthy()
          expect(result.items.length).toEqual(1)
        })
        const req = httpMock.expectOne('/api/leads?per_page=50')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            leads: [JSON.parse(JSON.stringify(lead))]
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
        const url = 'http://example.com/api/leads?cursor=10'
        const emptyParams = new HttpParams()
        service.leads({ url: url, params: emptyParams }).subscribe()
        const req = httpMock.expectOne(url)
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            leads: []
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
        service.leads({ url: null, params: params }).subscribe()
        const req = httpMock.expectOne('/api/leads?per_page=50&pipeline_id=1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            leads: []
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
  describe('lead', () => {
    it(
      'returns a Lead',
      async(() => {
        service.lead(1).subscribe((lead) => {
          expect(lead.id).toEqual(1)
          expect(lead.email).toEqual('lead@example.com')
          expect(lead.phoneNumber).toEqual('+999100200300')
          expect(lead.owner).not.toBeNull()
          expect(lead.owner!.id).toEqual(100)
          expect(lead.owner!.role).toEqual('sales_rep')
          expect(lead.owner!.name).toEqual('John Boon')
          expect(lead.owner!.email).toEqual('john@example.com')
          expect(lead.createdByUserId).toEqual(101)
          expect(lead.createdByServiceId).toBeNull()
          expect(Array.isArray(lead.fields)).toBeTruthy()
          expect(lead.fields[0].id).toBe(300)
          expect(lead.fields[0].name).toBe('website')
          expect(lead.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/leads/1')
        expect(req.request.method).toBe('GET')
        req.flush({
          data: {
            lead: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'lead@example.com',
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
  describe('createLead', () => {
    it(
      'returns a new lead',
      async(() => {
        service.createLead({}).subscribe((lead) => {
          expect(lead.id).toEqual(1)
          expect(lead.email).toEqual('lead@example.com')
          expect(lead.phoneNumber).toEqual('+999100200300')
          expect(lead.owner).not.toBeNull()
          expect(lead.owner!.id).toEqual(100)
          expect(lead.owner!.role).toEqual('sales_rep')
          expect(lead.owner!.name).toEqual('John Boon')
          expect(lead.owner!.email).toEqual('john@example.com')
          expect(lead.createdByUserId).toEqual(101)
          expect(lead.createdByServiceId).toBeNull()
          expect(Array.isArray(lead.fields)).toBeTruthy()
          expect(lead.fields[0].id).toBe(300)
          expect(lead.fields[0].name).toBe('website')
          expect(lead.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/leads')
        expect(req.request.method).toBe('POST')
        req.flush({
          data: {
            lead: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'lead@example.com',
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
  describe('updateLead', () => {
    it(
      'returns an updated lead',
      async(() => {
        service.updateLead(2, {}).subscribe((lead) => {
          expect(lead.id).toEqual(2)
          expect(lead.email).toEqual('lead@example.com')
          expect(lead.phoneNumber).toEqual('+999100200300')
          expect(lead.owner).not.toBeNull()
          expect(lead.owner!.id).toEqual(100)
          expect(lead.owner!.role).toEqual('sales_rep')
          expect(lead.owner!.name).toEqual('John Boon')
          expect(lead.owner!.email).toEqual('john@example.com')
          expect(lead.createdByUserId).toEqual(101)
          expect(lead.createdByServiceId).toBeNull()
          expect(Array.isArray(lead.fields)).toBeTruthy()
          expect(lead.fields[0].id).toBe(300)
          expect(lead.fields[0].name).toBe('website')
          expect(lead.fields[0].value).toBe('example.com')
        })
        const req = httpMock.expectOne('/api/leads/2')
        expect(req.request.method).toBe('PATCH')
        req.flush({
          data: {
            lead: {
              created_by_service_id: null,
              created_by_user_id: 101,
              email: 'lead@example.com',
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
  describe('createField', () => {
    it(
      'creates a new field',
      async(() => {
        const fieldCreate = {
          name: 'New Field'
        }
        service.createField(fieldCreate).subscribe((field) => {
          expect(field.id).toEqual(11)
          expect(field.name).toEqual('New Field')
        })
        const req = httpMock.expectOne('/api/fields')
        expect(req.request.method).toBe('POST')
        req.flush({
          data: {
            field: {
              id: 11,
              name: fieldCreate.name
            }
          }
        })
        httpMock.verify()
      })
    )
  })
  describe('updateField', () => {
    it(
      'updates an existing field',
      async(() => {
        const fieldUpdate = {
          name: 'Updated Field'
        }
        service.updateField(11, fieldUpdate).subscribe((field) => {
          expect(field.id).toEqual(11)
          expect(field.name).toEqual('Updated Field')
        })
        const req = httpMock.expectOne('/api/fields/11')
        expect(req.request.method).toBe('PATCH')
        req.flush({
          data: {
            field: {
              id: 11,
              name: fieldUpdate.name
            }
          }
        })
        httpMock.verify()
      })
    )
  })
})
