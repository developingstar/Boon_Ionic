import Konva from 'konva'

export class NodeValidation {
  static checkNodeSizes(height: number, width: number): void {
    if (!height || !width) {
      this.handleMissingNodeSizeError()
    }
  }

  static handleMissingNodeSizeError(): void {
    throw new Error(
      'Konva node does not have required size, please provide required size parameter. e.g {height: 100, width: 100}'
    )
  }
}
