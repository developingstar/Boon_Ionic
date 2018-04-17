import { JourneyPage } from '../../../src/app/journeys/journey.page'
import { PageObject } from '../../support/page.po'
import {
  ActionType,
  TriggerType
} from './../../../src/app/journeys/journeys.api.model'

export class JourneyPageObject extends PageObject<JourneyPage> {
  sidebarTriggers(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.sidebar event[type="trigger"]')
  }

  openNewTriggerModal(type: TriggerType): void {
    this.openNewEventModal('trigger', type)
  }

  sidebarActions(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.sidebar event[type="action"]')
  }

  openNewActionModal(type: ActionType): void {
    this.openNewEventModal('action', type)
  }

  contentTriggers(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>(
      '.content .events-group event[type="trigger"]'
    )
  }

  contentActions(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>(
      '.content .events-group event[type="action"]'
    )
  }

  openEditEventModal(position: number): void {
    const box = this.findDebugByCss(
      `.content .events-group event:nth-of-type(${position})`
    )!

    this.click(box)
  }

  deleteEvent(position: number): void {
    const element = this.findDebugByCss(
      `.content .events-group event:nth-of-type(${position}) .trash-icon`
    )!

    this.click(element)
  }

  expectEventBoxInformation(
    element: HTMLElement,
    description: string,
    details: string
  ): void {
    expect(this.boxDescription(element).textContent).toEqual(description)
    expect(this.boxDetails(element).textContent).toEqual(details)
  }

  private openNewEventModal(
    type: 'action' | 'trigger',
    kind: ActionType | TriggerType
  ): void {
    const box = this.findDebugByCss(
      `.sidebar event[type="${type}"][kind="${kind}"]`
    )!

    this.click(box)
  }

  private boxDescription(element: HTMLElement): Element {
    return element.children.item(1)
  }

  private boxDetails(element: HTMLElement): Element {
    return element.children.item(3)
  }
}
