import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import {
  blankHttpRequestOptions,
  IHttpRequestOptions
} from './../api/http-request-options'
import { PaginatedCollection } from './../api/paginated-collection'
import { Contact } from './contact.model'
import { FieldDefinition } from './field-definition.model'
import { Note } from './note.model'
import { Pipeline } from './pipeline.model'
import { Stage } from './stage.model'

@Injectable()
export class SalesService {
  public limit: number = 50

  constructor(private readonly http: HttpClient) {}

  public contacts(
    options: IHttpRequestOptions = blankHttpRequestOptions
  ): Observable<PaginatedCollection<Contact>> {
    return this.http
      .get(options.url || `/api/contacts?per_page=${this.limit}`, {
        params: options.params
      })
      .map((response: Crm.API.IContactsResponse) => {
        const page: PaginatedCollection<Contact> = {
          count: response.metadata.count,
          items: response.data.contacts.map((raw) => new Contact(raw)),
          nextPageLink: response.links.next,
          prevPageLink: response.links.prev
        }
        return page
      })
  }

  public contact(id: number): Observable<Contact> {
    return this.http.get(`/api/contacts/${id}`).map(
      (response: {
        readonly data: {
          readonly contact: Crm.API.IContact
        }
      }) => new Contact(response.data.contact)
    )
  }

  public createContact(
    contactCreate: Crm.API.IContactCreate
  ): Observable<Contact> {
    return this.http
      .post(`/api/contacts`, JSON.stringify({ contact: contactCreate }))
      .map(
        (response: {
          readonly data: {
            readonly contact: Crm.API.IContact
          }
        }) => new Contact(response.data.contact)
      )
  }

  public updateContact(
    id: number,
    contactUpdate: Crm.API.IContactUpdate
  ): Observable<Contact> {
    return this.http
      .patch(`/api/contacts/${id}`, JSON.stringify({ contact: contactUpdate }))
      .map(
        (response: {
          readonly data: {
            readonly contact: Crm.API.IContact
          }
        }) => new Contact(response.data.contact)
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

  public fields(): Observable<FieldDefinition[]> {
    return this.http
      .get(`/api/fields`)
      .map((response: { data: { fields: Crm.API.IFieldDefinition[] } }) =>
        response.data.fields.map((field) => new FieldDefinition(field))
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

  public stages(pipelineId: number | null = null): Observable<Stage[]> {
    return this.http
      .get(this.urlForStages(pipelineId))
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

  public notes(
    contactId: number | null = null
  ): Observable<ReadonlyArray<Note>> {
    return this.http
      .get(`/api/contacts/${contactId}/notes`)
      .map((response: Crm.API.INotesResponse) =>
        response.data.notes.map((item) => new Note(item))
      )
  }

  public createNote(
    contactId: number,
    noteData: Crm.API.INoteCreate
  ): Observable<Note> {
    return this.http
      .post(
        `/api/contacts/${contactId}/notes`,
        JSON.stringify({ note: noteData })
      )
      .map((response: { readonly data: { readonly note: Crm.API.INote } }) => {
        return new Note(response.data.note)
      })
  }

  private urlForStages(pipelineId: number | null): string {
    if (pipelineId === null) {
      return '/api/stages'
    } else {
      return `/api/pipelines/${pipelineId}/stages`
    }
  }
}
