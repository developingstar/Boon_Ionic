import Konva from 'konva'
import { Edge } from './edge'
import { Graph } from './graph'
import { Node } from './node'
import { Rectangle } from './rectangle'

export class DrawPoint extends Rectangle {
  static HEIGHT = 20
  static WIDTH = 20
  constructor(node: Node, config: Konva.RectConfig = {}) {
    const defaults: Konva.RectConfig = {
      cornerRadius: 6,
      fill: 'blue',
      height: DrawPoint.HEIGHT,
      shadowColor: 'black',
      strokeWidth: 0,
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
          this.x() + node.x(),
          this.y() + node.y(),
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
