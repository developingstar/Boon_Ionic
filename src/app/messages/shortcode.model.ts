import { ensureNonEmptyString } from '../utils/validators'
import * as API from './messages.api.model'

export class Shortcode {
  readonly name: string
  readonly shortcode: string

  constructor(data: API.IShortcode) {
    this.name = ensureNonEmptyString(data.name)
    this.shortcode = ensureNonEmptyString(data.shortcode)
  }
}
