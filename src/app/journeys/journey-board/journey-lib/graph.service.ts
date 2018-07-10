import Konva from 'konva'
import { Subject } from 'rxjs'
import { ActionType, TriggerType } from '../../journeys.api.model'
import { IEdge, INode } from './draw.service'
import { Edge } from './edge'
import { Graph } from './graph'
import { Node } from './node'

export class GraphService {
  public onNodeClick: Subject<any> = new Subject()
  nodes: Node[] = []
  currentEdge: Edge
  public addNode(
    data: INodeData,
    id: string = Graph.generateId(),
    x: number = 200,
    y: number = 200
  ): Node {
    const node = new Node(
      {
        draggable: true,
        id: id,
        x: Graph.calcSnapX(x),
        y: Graph.calcSnapY(y)
      },
      data
    )
    this.nodes.push(node)
    Graph.getLayer().add(node)
    Graph.getDrawService().redrawCanvas()
    return node
  }

  public addEdge(originId: string, targetId: string): void {
    const origin: Node = Graph.getLayer().find('#' + originId)[0]
    const target: Node = Graph.getLayer().find('#' + targetId)[0]
    if (origin && target) {
      const edge = new Edge(origin, {
        points: [origin.x(), origin.y(), target.x(), target.y()]
      })
      Graph.getLayer().add(edge)
      edge.setTarget(target)
      Graph.getDrawService().redrawCanvas()
    }
  }

  public drawFromData(nodes: INode[], edges?: IEdge[]): void {
    if (nodes) {
      nodes.forEach((node: any) => {
        this.addNode(node.data, node.id, node.x, node.y)
      })
      if (edges) {
        edges.forEach((edge: any) => {
          this.addEdge(edge.origin, edge.target)
        })
      }
    }
  }

  public updateCurrentEdge(edge: Edge): void {
    this.currentEdge = edge
    Graph.getLayer().add(this.currentEdge)
    const zIndex = this.currentEdge.getZIndex()
    this.currentEdge.origin.setZIndex(zIndex + 1)
    Graph.getDrawService().redrawCanvas()
  }

  public onMouseMove(e: any): void {
    if (!Graph.getDrawService().mouseDown) return
    const mouseX = e.evt.layerX
    const mouseY = e.evt.layerY
    const p = [
      this.currentEdge.arrow.points()[0],
      this.currentEdge.arrow.points()[1],
      mouseX,
      mouseY
    ]
    this.currentEdge.setAllPoints(p)
    this.currentEdge.isNearTarget(this.nodes)
    Graph.getDrawService().redrawCanvas()
  }

  public deleteNode(node: Node): void {
    this.deleteEdgesLinkedToNode(node)
    node.delete()
    Graph.getDrawService().redrawCanvas()
  }

  public deleteEdgeById(id: string, stage: Konva.Stage): void {
    const edge: Edge = stage.find('#' + id)[0]
    if (edge) edge.delete()
  }

  public deleteEdgesLinkedToNode(node: Node): void {
    const edgesArray = Graph.getDrawService().edges
    const edgesToDelete = edgesArray.reduce((array: string[], edge: IEdge) => {
      if (edge.origin === node.id() || edge.target === node.id()) {
        array.push(edge.id)
      }
      return array
    }, [])
    edgesToDelete.forEach((id: string) =>
      this.deleteEdgeById(id, node.getStage())
    )
  }
}

export interface INodeData {
  type: 'action' | 'trigger'
  kind: ActionType | TriggerType
}
