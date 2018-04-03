import { async, TestBed } from '@angular/core/testing'
import { Loading, LoadingController } from 'ionic-angular'

import { LoaderService } from './../../../src/app/api/loader.service'

describe('LoaderService', () => {
  let loadingController: any
  let loadingInstance: any
  let service: LoaderService

  beforeEach(
    async(() => {
      loadingInstance = jasmine.createSpyObj<Loading>('instance', {
        dismiss: () => new Promise((resolve) => resolve(true)),
        present: () => new Promise((resolve) => resolve(true))
      })

      loadingController = {
        create: () => loadingInstance
      }

      spyOn(loadingController, 'create').and.callThrough()

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          LoaderService,
          { provide: LoadingController, useValue: loadingController }
        ]
      })

      service = TestBed.get(LoaderService)
    })
  )

  describe('pending requests counter', () => {
    it('ensures that the loading message is presented when the counter is > 0', () => {
      service.incrementPendingRequests()

      expect(loadingController.create).toHaveBeenCalledTimes(1)
      expect(loadingInstance.present).toHaveBeenCalledTimes(1)
      expect(loadingInstance.dismiss).toHaveBeenCalledTimes(0)
    })

    it('does not create multiple loading messages when the counter is > 1', () => {
      service.incrementPendingRequests()
      service.incrementPendingRequests()
      service.incrementPendingRequests()

      service.decrementPendingRequests()

      expect(loadingController.create).toHaveBeenCalledTimes(1)
      expect(loadingInstance.present).toHaveBeenCalledTimes(1)
      expect(loadingInstance.dismiss).toHaveBeenCalledTimes(0)
    })

    it('ensures that the loading message is dismissed when the counter is 0', () => {
      service.incrementPendingRequests()
      service.incrementPendingRequests()

      service.decrementPendingRequests()
      service.decrementPendingRequests()

      expect(loadingController.create).toHaveBeenCalledTimes(1)
      expect(loadingInstance.present).toHaveBeenCalledTimes(1)
      expect(loadingInstance.dismiss).toHaveBeenCalledTimes(1)
    })

    it('ensures that the service works even if the counter reached value < 0', () => {
      service.incrementPendingRequests()
      service.decrementPendingRequests()
      service.incrementPendingRequests()
      service.decrementPendingRequests()

      expect(loadingController.create).toHaveBeenCalledTimes(2)
      expect(loadingInstance.present).toHaveBeenCalledTimes(2)
      expect(loadingInstance.dismiss).toHaveBeenCalledTimes(2)
    })
  })
})
