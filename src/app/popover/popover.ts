import { Component, OnInit } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'

export interface IPopoverResult {
  name: string
  data: any
}

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage implements OnInit {
  public instanceName: string
  constructor(public viewController: ViewController) {}

  ngOnInit(): void {
    this.instanceName = this.viewController.data.instanceName
  }

  public changePipeline(): void {
    this.dismiss({ name: 'changePipeline', data: null })
  }

  private dismiss(action: IPopoverResult): void {
    this.viewController.dismiss(action)
  }
}
