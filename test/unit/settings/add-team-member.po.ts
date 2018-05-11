// import { DebugElement } from '@angular/core'

import { AddEditTeamMemberPage } from '../../../src/app/settings/team-members/add-edit-team-member.page'
import { PageObject } from '../../support/page.po'
// import { FieldPageObject } from '../crm/field.component.po'

export class AddTeamMembersPageObject extends PageObject<
  AddEditTeamMemberPage
> {
  get header(): string | undefined {
    return this.findByCss<HTMLElement>('h1')!.textContent || undefined
  }

  get userName(): string | undefined | null {
    return this.findDebugByCss('.user-name input')!.nativeElement.value
  }

  get buttonText(): any[] {
    return this.findAllByCss('.settings-button .button-inner')
  }

  get buttonState(): any[] {
    return this.findAllByCss('.settings-button')
  }

  get value(): string {
    return this.findByCss<HTMLInputElement>('input')!.value
  }
}
