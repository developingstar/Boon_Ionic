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
    return this.findAllByCss<HTMLElement>('.definition-body .triggers event')
  }

  contentActions(): HTMLElement[] {
    return this.findAllByCss<HTMLElement>('.definition-body .actions event')
  }

  openEditTriggerModal(position: number): void {
    this.openEditEventModal('trigger', position)
  }

  openEditActionModal(position: number): void {
    this.openEditEventModal('action', position)
  }

  deleteTrigger(position: number): void {
    this.deleteEvent('trigger', position)
  }

  deleteAction(position: number): void {
    this.deleteEvent('action', position)
  }

  expectEventBoxInformation(
    element: HTMLElement,
    description: string,
    details: string
  ): void {
    expect(element.children.item(1).textContent).toEqual(description)
    expect(element.children.item(3).textContent).toEqual(details)
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

  private openEditEventModal(
    type: 'action' | 'trigger',
    position: number
  ): void {
    const box = this.findDebugByCss(
      `.definition-body .${type}s event:nth-of-type(${position})`
    )!

    this.click(box)
  }

  private deleteEvent(type: 'action' | 'trigger', position: number): void {
    const element = this.findDebugByCss(
      `.definition-body .${type}s event:nth-of-type(${position}) .trash-icon`
    )!

    this.click(element)
  }
}
