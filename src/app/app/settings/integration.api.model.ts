export interface IServicesResponse {
  readonly data: {
    readonly services: ReadonlyArray<IService>
  }
}

export interface IServiceResponse {
  readonly data: {
    readonly service: IService
  }
}

export interface IService {
  readonly id: number
  readonly name: string
  readonly token: string
}
