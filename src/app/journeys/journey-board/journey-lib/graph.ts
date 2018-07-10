import Konva from 'konva'
import { Subscription } from 'rxjs'
import { v4 as UUID } from 'uuid'
import { DrawService, IEdge, INode } from './draw.service'
import { Edge } from './edge'
import { GraphService, INodeData } from './graph.service'
import { Grid } from './grid'

export class Graph {
  static getGraphService(): GraphService {
    if (!this.graphService) this.graphService = new GraphService()
    return this.graphService
  }
  static getDrawService(): DrawService {
    if (!this.drawService) this.drawService = new DrawService()
    return this.drawService
  }
  static calcSnapX(position: number): number {
    const snapSize = 30
    return Math.round(position / snapSize) * snapSize
  }
  static calcSnapY(position: number): number {
    const snapSize = 30
    return Math.round(position / snapSize) * snapSize
  }
  static generateId(): string {
    return UUID()
  }
  static getLayer(): Konva.Layer {
    if (!this.layer) this.layer = new Konva.Layer()
    return this.layer
  }

  private static graphService: GraphService
  private static drawService: DrawService
  private static layer: Konva.Layer

  public layer: Konva.Layer = Graph.getLayer()
  public graphService: GraphService = Graph.getGraphService()
  public stage: Konva.Stage
  public currentEdge: Edge
  public grid: Grid
  public layerDrawSubscription: Subscription
  constructor() {
    this.stage = new Konva.Stage({
      container: 'container', // id of container <div>
      height: 1500,
      width: 2500
    })
    this.grid = new Grid(this.stage)
    this.stage.add(this.grid)
    this.stage.add(this.layer)
    this.layerDrawSubscription = Graph.getDrawService().onLayerDraw.subscribe(
      () => {
        this.layer.draw()
      }
    )
    Graph.getDrawService().onDraw.subscribe((onDraw) => {
      this.graphService.updateCurrentEdge(onDraw.shape as Edge)
    })

    this.stage.on('contentMouseup', (event: any) => {
      if (Graph.getDrawService().isDrawing) {
        if (
          this.graphService.currentEdge.isNearTarget(this.graphService.nodes)
        ) {
          // snap to target and set target on edge
          this.graphService.currentEdge.setTarget()
        } else {
          this.graphService.currentEdge.delete()
        }
        Graph.getDrawService().redrawCanvas()
        Graph.getDrawService().stopDrawing()
      }
    })

    this.stage.on('contentMousedown contentMousemove', (ev: any) => {
      this.graphService.onMouseMove(ev)
    })
  }

  public addNode(data: INodeData, id?: string, x?: number, y?: number): any {
    return this.graphService.addNode(data, id, x, y)
  }
  public addEdge(originId: string, targetId: string): void {
    this.graphService.addEdge(originId, targetId)
  }
  public drawFromData(nodes: INode[], edges?: IEdge[]): void {
    this.graphService.drawFromData(nodes, edges)
  }
  public clearLayer(): void {
    this.layer.destroy()
    Graph.getDrawService().edges = []
    Graph.getDrawService().nodes = []
    Graph.getGraphService().nodes = []
    this.layer = Graph.getLayer()
    this.stage.add(this.layer)
    this.layerDrawSubscription.unsubscribe()
    this.layerDrawSubscription = Graph.getDrawService().onLayerDraw.subscribe(
      () => {
        this.layer.draw()
      }
    )
  }
  public destroy(): void {
    this.stage.destroy()
  }
}
