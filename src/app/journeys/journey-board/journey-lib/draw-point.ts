import Konva from 'konva'
import { Edge } from './edge'
import { Graph } from './graph'
import { Node } from './node'
import { Rectangle } from './rectangle'

export class DrawPoint extends Konva.Image {
  static HEIGHT = 30
  static WIDTH = 30
  constructor(node: Node, config: any = {}) {
    const imageObj = new Image()
    imageObj.src = '/assets/icon/journey/draw-point.svg'
    const defaults: Konva.ImageConfig = {
      height: DrawPoint.HEIGHT,
      image: imageObj,
      visible: false,
      width: DrawPoint.WIDTH,
      x: Rectangle.BASE_WIDTH - DrawPoint.WIDTH / 2,
      y: (Rectangle.BASE_HEIGHT - DrawPoint.HEIGHT) / 2,
      ...config
    }
    super(defaults)
    this.on('mousedown', (event: any) => {
      this.draggable(false)
      const edge = new Edge(node, {
        points: [
          node.x() + node.getWidth() / 2,
          node.y() + node.getHeight() / 2,
          this.x() + node.x(),
          this.y() + node.y()
        ]
      })
      Graph.getDrawService().startDrawing({
        shape: edge,
        x: this.x() + node.x(),
        y: this.y() + node.y()
      })
    })
  }
}
