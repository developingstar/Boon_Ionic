import Konva from 'konva'
import { DrawService, IOnDraw } from './draw.service'
import { Edge } from './edge'
import { EdgeValidation } from './edge.validations'
import { Node } from './node'
import { NodeValidation } from './node.validations'
import { Rectangle } from './rectangle'

export class Graph {
  static getDrawService(): DrawService {
    if (!this.drawService) this.drawService = new DrawService()
    return this.drawService
  }

  private static drawService: DrawService

  public stage: any
  public layer: Konva.Layer
  public nodes: Node[] = [] // TODO: make this an attribute on a new class for layer
  public currentEdge: Edge
  // then create layer
  constructor() {
    this.stage = new Konva.Stage({
      container: 'container', // id of container <div>
      height: window.innerHeight,
      width: window.innerWidth
    })

    // then create layer
    this.layer = new Konva.Layer()

    this.stage.add(this.layer)

    Graph.getDrawService().onLayerDraw.subscribe(() => {
      this.layer.draw()
    })
    Graph.getDrawService().onDraw.subscribe((onDraw) => {
      this.currentEdge = onDraw.shape as Edge
      this.layer.add(this.currentEdge)
      Graph.getDrawService().redrawCanvas()
    })

    this.stage.on('contentMouseup', (event: any) => {
      if (Graph.getDrawService().isDrawing) {
        if (this.currentEdge.isNearTarget(this.nodes)) {
          // snap to target and set target on edge
          this.currentEdge.setTarget()
        } else {
          this.currentEdge.destroy()
        }
        Graph.getDrawService().redrawCanvas()
        Graph.getDrawService().stopDrawing()
      }
    })

    this.stage.on(
      'contentMousedown contentMousemove',
      this.onMouseMove.bind(this)
    )
  }
  //TODO: Change id generation to something better
  public addNode(
    id: string = Math.random().toString(),
    x: number = 200,
    y: number = 200
  ): void {
    const node = new Node(this, {
      draggable: true,
      id: id,
      x: x,
      y: y
    })
    this.nodes.push(node)
    this.layer.add(node)
    Graph.getDrawService().redrawCanvas()
  }

  public addEdges(originId: string, targetId: string): void {
    const origin: Node = this.layer.find('#' + originId)[0]
    const target: Node = this.layer.find('#' + targetId)[0]
    if (origin && target) {
      const edge = new Edge(origin, {
        points: [origin.x(), origin.y(), target.x(), target.y()]
      })
      this.layer.add(edge)
      edge.setTarget(target)
      Graph.getDrawService().redrawCanvas()
    }
  }

  public onMouseMove(e: any): void {
    if (!Graph.getDrawService().mouseDown) return
    const mouseX = e.evt.layerX
    const mouseY = e.evt.layerY
    const p = [
      this.currentEdge.points()[0],
      this.currentEdge.points()[1],
      mouseX,
      mouseY
    ]
    this.currentEdge.points(p)
    this.currentEdge.isNearTarget(this.nodes)
    Graph.getDrawService().redrawCanvas()
  }
}
