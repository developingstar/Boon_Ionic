export class NavControllerStub {
  constructor(public active: {} = { name: 'CrmPage' }) {}

  getActive(): {} {
    return this.active
  }

  setRoot(): void {
    return
  }
}
