declare namespace Crm {
  namespace API {
    interface IPipeline {
      readonly id: number
      readonly name: string
      readonly stage_order: ReadonlyArray<number>
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
      readonly id: number
      readonly name: string
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
      readonly email?: string
      readonly phone_number?: string
      readonly stage_id?: number
      readonly owner_id?: number | null
      readonly fields?: ReadonlyArray<ILeadFieldUpdate>
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
  }
}
