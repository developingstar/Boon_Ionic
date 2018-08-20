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

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [GroupsService]
      })

      httpMock = TestBed.get(HttpTestingController)
      groupsService = TestBed.get(GroupsService)
    })
  )

  describe('groups', () => {
    it(
      'returns an array',
      async(() => {
        const group1 = sampleGroup({
          id: 1,
          name: 'Group1'
        })

        const group2 = sampleGroup({
          id: 2,
          name: 'Group2'
        })

        groupsService.groups().subscribe((result: ReadonlyArray<Group>) => {
          expect(result.length).toEqual(2)
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
      })
    )
  })

  describe('group', () => {
    it(
      'returns a group',
      async(() => {
        const group = sampleGroup()

        groupsService.group(1).subscribe((result: Group | undefined) => {
          expect(result).toEqual(group)
        })

        const req = httpMock.expectOne('/api/groups/1')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            group: group
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('createGroup', () => {
    it(
      'returns the created group',
      async(() => {
        groupsService
          .createGroup({ name: 'CreateGroup' })
          .subscribe((result) => {
            expect(result.name).toEqual('CreateGroup')
          })

        const req = httpMock.expectOne('/api/groups')
        expect(req.request.method).toBe('POST')

        req.flush({
          data: {
            group: {
              id: 1,
              name: 'CreateGroup'
            }
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('updateGroup', () => {
    it(
      'returns the updated group',
      async(() => {
        const group = sampleGroup()

        groupsService.updateGroup(1, group).subscribe((result) => {
          expect(result.id).toEqual(1)
          expect(result.name).toEqual('Group Name')
        })

        const req = httpMock.expectOne('/api/groups/1')
        expect(req.request.method).toBe('PATCH')

        req.flush({
          data: {
            group: group
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('groupusers', () => {
    it(
      'returns an array of users',
      async(() => {
        groupsService.groupUsers(1).subscribe((users) => {
          expect(users.length).toEqual(2)
          expect(users[0].id).toEqual(11)
          expect(users[0].name).toEqual('John Boon')
          expect(users[0].email).toEqual('john@example.com')
          expect(users[0].role).toEqual('admin')
          expect(users[1].id).toEqual(12)
          expect(users[1].name).toEqual('Mark Boon')
          expect(users[1].email).toEqual('mark@example.com')
          expect(users[1].role).toEqual('sales_rep')
        })

        const req = httpMock.expectOne('/api/groups/1/users')
        expect(req.request.method).toBe('GET')

        req.flush({
          data: {
            users: [
              {
                email: 'john@example.com',
                id: 11,
                name: 'John Boon',
                role: 'admin'
              },
              {
                email: 'mark@example.com',
                id: 12,
                name: 'Mark Boon',
                role: 'sales_rep'
              }
            ]
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('addUser', () => {
    it(
      'returns the success message',
      async(() => {
        groupsService.addUser(1, 12).subscribe((result) => {
          expect(result.data.message).toEqual('OK')
        })

        const req = httpMock.expectOne('/api/groups/1/users/12')
        expect(req.request.method).toBe('POST')

        req.flush({
          data: {
            message: 'OK'
          }
        })

        httpMock.verify()
      })
    )
  })

  describe('deleteUser', () => {
    it(
      'returns the success message',
      async(() => {
        groupsService.deleteUser(1, 12).subscribe((result) => {
          expect(result.data.message).toEqual('OK')
        })

        const req = httpMock.expectOne('/api/groups/1/users/12')
        expect(req.request.method).toBe('DELETE')

        req.flush({
          data: {
            message: 'OK'
          }
        })

        httpMock.verify()
      })
    )
  })
})
