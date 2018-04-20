import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'

import { Group } from '../../../src/app/settings/group.model'
import { GroupsService } from '../../../src/app/settings/groups.service'
import { sampleGroup } from '../../support/factories'

describe('GroupsService', () => {
  let httpMock: HttpTestingController
  let groupsService: GroupsService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    })

    httpMock = TestBed.get(HttpTestingController)
    groupsService = TestBed.get(GroupsService)
  }))

  describe('groups', () => {
    it('returns an array', async(() => {
      const group1 = sampleGroup({
        id: 1,
        name: 'Group1'
      })

      const group2 = sampleGroup({
        id: 2,
        name: 'Group2'
      })

      groupsService.groups().subscribe((result: ReadonlyArray<Group>) => {
        expect(result).toEqual([group1, group2])
      })

      const req = httpMock.expectOne('/api/groups')
      expect(req.request.method).toBe('GET')

      req.flush({
        data: {
          groups: [
            JSON.parse(JSON.stringify(group1)),
            JSON.parse(JSON.stringify(group2))
          ]
        }
      })

      httpMock.verify()
    }))
  })
})
