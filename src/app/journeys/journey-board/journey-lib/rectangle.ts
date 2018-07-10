import Konva from 'konva'

export class Rectangle extends Konva.Rect {
  static BASE_HEIGHT = 94
  static BASE_WIDTH = 120
  constructor(config: Konva.RectConfig = {}) {
    const defaults: Konva.RectConfig = {
      cornerRadius: 6,
      fill: 'white',
      height: Rectangle.BASE_HEIGHT,
      shadowBlur: 15,
      shadowColor: 'rgba(0,0,0,.22)',
      strokeWidth: 0,
      width: Rectangle.BASE_WIDTH,
      x: 0,
      y: 0,
      ...config
    }
    super(defaults)
  }
}
