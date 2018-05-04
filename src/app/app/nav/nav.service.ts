import { CdkPortal } from '@angular/cdk/portal'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type NavContent = CdkPortal | undefined

// Navigation service.
//
// Allows to toggle the nav bar visibility and set its content.
@Injectable()
export class NavService {
  public readonly navBarVisible = new BehaviorSubject<boolean>(false)

  public readonly contentUpdated = new BehaviorSubject<
    [NavContent, NavContent]
  >([undefined, undefined])
}
