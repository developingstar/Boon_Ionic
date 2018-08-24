import { TeamMembersPage } from '../../../src/app/settings/team-members/team-members.page'
import { PageObject } from '../../support/page.po'

export class TeamMembersPageObject extends PageObject<TeamMembersPage> {
  get header(): string | undefined {
    return this.findByCss<HTMLElement>('h1')!.textContent || undefined
  }

  get settingsButton(): any[] {
    return this.findAllByCss('.settings-button')
  }

  get getTeamMembers(): any[] {
    return this.findAllByCss('.single-team-member')
  }

  get getUserNames(): any[] {
    return this.findAllByCss('.member-name').map(
      (res: HTMLElement) => res.textContent
    )
  }
}
