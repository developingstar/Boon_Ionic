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

  public fields(): Observable<ReadonlyArray<FieldDefinition>> {
    return this.http
      .get(`/api/fields`)
      .map(
        (response: {
          readonly data: {
            readonly fields: ReadonlyArray<Crm.API.IFieldDefinition>
          }
        }) => response.data.fields.map((field) => new FieldDefinition(field))
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

  public stages(
    pipeline_id: number | null = null
  ): Observable<ReadonlyArray<Stage>> {
    return this.http
      .get(this.urlForStages(pipeline_id))
      .map((response: Crm.API.IStagesResponse) =>
        response.data.stages.map((item) => new Stage(item))
      )
  }

  public pipelines(): Observable<ReadonlyArray<Pipeline>> {
    return this.http
      .get('/api/pipelines')
      .map((response: Crm.API.IPipelinesResponse) =>
        response.data.pipelines.map((item) => new Pipeline(item))
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
