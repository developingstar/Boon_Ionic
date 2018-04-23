import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ensurePhoneNumber } from '../utils/validators'

@Injectable()
export class PhoneNumbersService {
  constructor(private readonly http: HttpClient) {}

  public getAll(): Observable<ReadonlyArray<string>> {
    return this.http
      .get('/api/phone_numbers')
      .map(
        (response: {
          readonly data: {
            readonly phone_numbers: ReadonlyArray<{
              readonly phone_number: string
            }>
          }
        }) =>
          response.data.phone_numbers.map((object) =>
            ensurePhoneNumber(object.phone_number)
          )
      )
  }
}
