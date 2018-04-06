export interface IServicesResponse {
  readonly data: {
    readonly services: ReadonlyArray<IServiceData>
  }
}

export interface IServiceResponse {
  readonly data: IServiceData
}

interface IServiceData {
  readonly service: IService
}

export interface IService {
  readonly id: number
  readonly name: string
  readonly token: string
}
