import { async, TestBed } from '@angular/core/testing'

import { LoaderService } from './../../../src/app/api/loader.service'

describe('LoaderService', () => {
  let service: LoaderService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [LoaderService]
      })

      service = TestBed.get(LoaderService)
    })
  )

  describe('pendingRequestsCounter', () => {
    it(
      'returns an observable current value',
      async(() => {
        const valueStates: number[] = []
        service.pendingRequestsCounter.subscribe((v) => valueStates.push(v))

        service.incrementPendingRequests()
        service.incrementPendingRequests()
        service.decrementPendingRequests()
        service.decrementPendingRequests()
        service.incrementPendingRequests()

        expect(valueStates).toEqual([0, 1, 2, 1, 0, 1])
      })
    )
  })
})
