import { ensurePhoneNumber } from '../../utils/validators'

export class PhoneNumber {
  readonly phoneNumber: string

  constructor(data: any) {
    this.phoneNumber = ensurePhoneNumber(data.phone_number)
  }
}
