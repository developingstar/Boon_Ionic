import Konva from 'konva'

export class NodeImage extends Konva.Image {
  static BASE_HEIGHT = 37
  static BASE_WIDTH = 37

  constructor(config: Konva.ImageConfig) {
    const defaults: Konva.ImageConfig = {
      height: NodeImage.BASE_HEIGHT,
      width: NodeImage.BASE_WIDTH,
      x: 0,
      y: 0,
      ...config
    }
    super(defaults)
  }
}
