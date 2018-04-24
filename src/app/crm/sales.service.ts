import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
import { PaginatedCollection } from './../api/paginated-collection'
import { FieldDefinition } from './field-definition.model'
import { Lead } from './lead.model'
import { Pipeline } from './pipeline.model'
import { Stage } from './stage.model'

@Injectable()
export class SalesService {
  constructor(private readonly http: HttpClient) {}

  public leads(
    options: IHttpRequestOptions = blankHttpRequestOptions
  ): Observable<PaginatedCollection<Lead>> {
    return this.http
      .get(options.url || '/api/leads', { params: options.params })
      .map((response: Crm.API.ILeadsResponse) => {
        const page: PaginatedCollection<Lead> = {
          items: response.data.leads.map((raw) => new Lead(raw)),
          nextPageLink: response.links.next,
          prevPageLink: response.links.prev
        }

        return page
      })
  }

  public lead(id: number): Observable<Lead> {
    return this.http.get(`/api/leads/${id}`).map(
      (response: {
        readonly data: {
          readonly lead: Crm.API.ILead
        }
      }) => new Lead(response.data.lead)
    )
  }

  public createLead(leadCreate: Crm.API.ILeadCreate): Observable<Lead> {
    return this.http
      .post(`/api/leads`, JSON.stringify({ lead: leadCreate }))
      .map(
        (response: {
          readonly data: {
            readonly lead: Crm.API.ILead
          }
        }) => new Lead(response.data.lead)
      )
  }

  public updateLead(
    id: number,
    leadUpdate: Crm.API.ILeadUpdate
  ): Observable<Lead> {
    return this.http
      .patch(`/api/leads/${id}`, JSON.stringify({ lead: leadUpdate }))
      .map(
        (response: {
          readonly data: {
            readonly lead: Crm.API.ILead
          }
        }) => new Lead(response.data.lead)
      )
  }

  public field(id: number): Observable<FieldDefinition | undefined> {
    return this.http.get(`/api/fields/${id}`).map(
      (response: {
        readonly data: {
          readonly field: Crm.API.IFieldDefinition
        }
      }) => new FieldDefinition(response.data.field)
    )
  }

  public fields(): Observable<Array<FieldDefinition>> {
    return this.http
      .get(`/api/fields`)
      .map((response: { data: { fields: Array<Crm.API.IFieldDefinition> } }) =>
        response.data.fields.map((field) => new FieldDefinition(field))
      )
  }

  public createField(
    field: Crm.API.IFieldDefinitionCreate
  ): Observable<FieldDefinition> {
    return this.http
      .post(`/api/fields`, JSON.stringify({ field: field }))
      .map(
        (response: {
          readonly data: { readonly field: Crm.API.IFieldDefinition }
        }) => new FieldDefinition(response.data.field)
      )
  }

  public updateField(
    id: number,
    field: Crm.API.IFieldDefinitionUpdate
  ): Observable<FieldDefinition> {
    return this.http
      .patch(`/api/fields/${id}`, JSON.stringify({ field: field }))
      .map(
        (response: {
          readonly data: { readonly field: Crm.API.IFieldDefinition }
        }) => new FieldDefinition(response.data.field)
      )
  }

  public stage(id: number): Observable<Stage> {
    return this.http.get(`/api/stages/${id}`).map(
      (response: {
        readonly data: {
          readonly stage: Crm.API.IStage
        }
      }) => new Stage(response.data.stage)
    )
  }

  public stages(pipeline_id: number | null = null): Observable<Array<Stage>> {
    return this.http
      .get(this.urlForStages(pipeline_id))
      .map((response: Crm.API.IStagesResponse) =>
        response.data.stages.map((item) => new Stage(item))
      )
  }

  public pipeline(id: number): Observable<Pipeline | undefined> {
    return this.http
      .get(`/api/pipelines/${id}`)
      .map(
        (response: Crm.API.IPipelineResponse) =>
          new Pipeline(response.data.pipeline)
      )
  }

  public pipelines(): Observable<ReadonlyArray<Pipeline>> {
    return this.http
      .get('/api/pipelines')
      .map((response: Crm.API.IPipelinesResponse) =>
        response.data.pipelines.map((item) => new Pipeline(item))
      )
  }

  public createPipeline(
    pipelineData: Crm.API.IPipelineCreate
  ): Observable<Pipeline> {
    return this.http
      .post('/api/pipelines', JSON.stringify({ pipeline: pipelineData }))
      .map(
        (response: {
          readonly data: {
            readonly pipeline: Crm.API.IPipeline
          }
        }) => new Pipeline(response.data.pipeline)
      )
  }

  public updatePipeline(
    id: number,
    pipelineData: Crm.API.IPipelineUpdate
  ): Observable<Pipeline> {
    return this.http
      .patch(`/api/pipelines/${id}`, JSON.stringify({ pipeline: pipelineData }))
      .map(
        (response: {
          readonly data: {
            readonly pipeline: Crm.API.IPipeline
          }
        }) => new Pipeline(response.data.pipeline)
      )
  }

  public createStage(
    pipelineId: number,
    stageData: Crm.API.IStageCreate
  ): Observable<Stage> {
    return this.http
      .post(this.urlForStages(pipelineId), JSON.stringify({ stage: stageData }))
      .map(
        (response: {
          readonly data: {
            readonly stage: Crm.API.IStage
          }
        }) => new Stage(response.data.stage)
      )
  }

  public updateStage(
    id: number,
    stageData: Crm.API.IStageUpdate
  ): Observable<Stage> {
    return this.http
      .patch(
        `${this.urlForStages(null)}/${id}`,
        JSON.stringify({ stage: stageData })
      )
      .map(
        (response: {
          readonly data: {
            readonly stage: Crm.API.IStage
          }
        }) => new Stage(response.data.stage)
      )
  }

  private urlForStages(pipeline_id: number | null): string {
    if (pipeline_id === null) {
      return '/api/stages'
    } else {
      return `/api/pipelines/${pipeline_id}/stages`
    }
  }
}
