declare namespace Crm {
  namespace API {
    interface IPipeline {
      readonly id: number
      readonly name: string
      readonly stage_order: ReadonlyArray<number>
    }

    interface IPipelineResponse {
      readonly data: {
        readonly pipeline: IPipeline
      }
    }

    interface IPipelinesResponse {
      readonly data: {
        readonly pipelines: ReadonlyArray<IPipeline>
      }
    }

    interface IStage {
      readonly id: number
      readonly name: string
      readonly pipeline_id: number
    }

    interface IStagesResponse {
      readonly data: {
        readonly stages: ReadonlyArray<IStage>
      }
    }

    interface IFieldDefinition {
      id: number
      name: string
    }

    interface IFieldDefinitionCreate {
      readonly name: string
    }

    interface IFieldDefinitionUpdate {
      readonly name?: string
    }

    interface IField {
      readonly id: number
      readonly name: string
      readonly value: string
    }

    interface IFilterLead {
      readonly id: number
      readonly value: string
    }

    interface ILead {
      readonly created_by_service_id: number | null
      readonly created_by_user_id: number | null
      readonly email: string | null
      readonly fields: ReadonlyArray<IField>
      readonly id: number
      readonly owner: Auth.API.IUser | null
      readonly phone_number: string
      readonly stage_id: number
    }

    interface ILeadsResponse {
      readonly links: {
        readonly prev: string | null
        readonly next: string | null
      }
      readonly data: {
        readonly leads: ReadonlyArray<ILead>
      }
    }

    interface ILeadCreate {
      email?: string
      phone_number?: string
      stage_id?: number
      owner_id?: number | null
      pipeline_id?: number | null
      fields?: Array<ILeadFieldUpdate>
    }

    type ILeadUpdate = ILeadCreate

    interface ILeadFieldUpdate {
      readonly id: number
      readonly value: string
    }

    interface IPipelineCreate {
      readonly name: string
      readonly stage_order?: ReadonlyArray<number>
    }

    interface IPipelineUpdate {
      readonly name?: string
      readonly stage_order?: ReadonlyArray<number>
    }

    interface IStageCreate {
      readonly name: string
    }

    interface IStageUpdate {
      readonly name?: string
    }

    interface INotesResponse {
      readonly data: {
        readonly notes: ReadonlyArray<INote>
      }
    }

    interface INote {
      readonly id: number
      readonly content: string
    }

    interface INoteCreate {
      readonly content: string
    }
  }
}
