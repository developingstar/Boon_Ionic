import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '../../auth/user.model'
import { PhoneNumber } from './phone_number.model'

@Injectable()
export class TeamMembersService {
  constructor(private readonly http: HttpClient) {}

  public getTeamMembers(): Observable<User[]> {
    return this.http
      .get(`/api/users`)
      .map((response: TeamSettings.ITeamMembers) =>
        response.data.users.map((user) => new User(user))
      )
  }

  public getTeamMember(userId: string): Observable<User> {
    return this.http
      .get(`/api/users/${userId}`)
      .map((response: TeamSettings.ITeamMember) => new User(response.data.user))
  }

  public getNumbers(): any {
    return this.http
      .get(`/api/phone_numbers`)
      .map((response: TeamSettings.IPhoneNumbers) =>
        response.data.phone_numbers.map(
          (phoneNumber) => new PhoneNumber(phoneNumber)
        )
      )
      .shareReplay(1)
  }

  public addTeamMember(teamMember: User): Observable<User> {
    return this.http
      .post(`api/users/`, JSON.stringify({ user: teamMember }))
      .map((response: TeamSettings.ITeamMember) => new User(response.data.user))
  }

  public updateTeamMember(teamMember: User): Observable<User> {
    return this.http
      .patch(`api/users/${teamMember.id}`, JSON.stringify({ user: teamMember }))
      .map((response: TeamSettings.ITeamMember) => new User(response.data.user))
  }

  public addTeamMemberImage(
    teamMemberId: number,
    imageForm: FormData
  ): Observable<User> {
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'multipart/form-data'
    }
    const requestOptions = {
      headers: new HttpHeaders(headers)
    }
    return this.http
      .post(`/api/users/${teamMemberId}/avatar`, imageForm, requestOptions)
      .map((response: TeamSettings.ITeamMember) => new User(response.data.user))
  }
}
