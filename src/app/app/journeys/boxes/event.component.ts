import { Component, Input } from '@angular/core'

import { ActionType, TriggerType } from '../journeys.api.model'

@Component({
  selector: 'event',
  templateUrl: 'event.component.html'
})
export class EventComponent {
  @Input() public readonly type: 'action' | 'trigger'
  @Input() public readonly kind: ActionType | TriggerType

  get iconPath(): string {
    return `assets/icon/journey/${this.type}s/${this.kind}.svg`
  }

  get description(): string {
    return this.kind.replace(/\_/g, ' ')
  }
}
