import Konva from 'konva'
import { NodeValidation } from './node.validations'

export class Rectangle extends Konva.Rect {
  static BASE_HEIGHT = 94
  static BASE_WIDTH = 120
  // then create layer
  constructor(config: Konva.RectConfig = {}) {
    const defaults: Konva.RectConfig = {
      cornerRadius: 6,
      fill: 'white',
      height: Rectangle.BASE_HEIGHT,
      shadowColor: 'rgba(0,0,0,0.11)',
      strokeWidth: 0,
      width: Rectangle.BASE_WIDTH,
      x: 0,
      y: 0,
      ...config
    }
    super(defaults)
  }
}
