// tslint:disable-next-line:no-submodule-imports
import { of } from 'rxjs/observable/of'
import { User } from '../../../src/app/auth/user.model'
import { TeamMembersService } from '../../../src/app/settings/team-members/team-members.service'

describe('TeamMemberService', () => {
  let teamMemberService: TeamMembersService
  let mockHttp: any

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('mockHttp', ['get', 'post', 'patch'])

    teamMemberService = new TeamMembersService(mockHttp)
  })

  it('should call the http get with users url', () => {
    mockHttp.get.and.returnValue(of(false))
    teamMemberService.getTeamMembers()

    expect(mockHttp.get).toHaveBeenCalledWith('/api/users')
  })

  it('should call the http get with user url', () => {
    mockHttp.get.and.returnValue(of(false))
    teamMemberService.getTeamMember('1')

    expect(mockHttp.get).toHaveBeenCalledWith('/api/users/1')
  })

  it('should call the http get with phone numbers url', () => {
    mockHttp.get.and.returnValue(of(false))
    teamMemberService.getNumbers()

    expect(mockHttp.get).toHaveBeenCalledWith('/api/phone_numbers')
  })

  it('should call the http post with users url', () => {
    const teamMember = new User({
      avatar_url: '',
      email: 'john@example.com',
      id: 100,
      name: 'John Boon',
      password: '',
      phone_number: '',
      role: 'admin'
    })

    mockHttp.post.and.returnValue(of(false))
    teamMemberService.addTeamMember(teamMember)

    expect(mockHttp.post).toHaveBeenCalledWith(
      'api/users/',
      JSON.stringify({ user: teamMember })
    )
  })

  it('should call the http patch with users url and id and user object', () => {
    const teamMember = new User({
      avatar_url: '',
      email: 'john@example.com',
      id: 100,
      name: 'John Boon',
      password: '',
      phone_number: '',
      role: 'admin'
    })

    mockHttp.patch.and.returnValue(of(false))
    teamMemberService.updateTeamMember(teamMember)

    expect(mockHttp.patch).toHaveBeenCalledWith(
      'api/users/100',
      JSON.stringify({ user: teamMember })
    )
  })

  it('should call the http post with user avatar url and form data', () => {
    const image = new FormData()

    mockHttp.post.and.returnValue(of(false))
    teamMemberService.addTeamMemberImage(1, image)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/users/1/avatar',
      image,
      jasmine.any(Object)
    )
  })
})
