import Konva, { Arrow, Circle, Line } from 'konva'
import { Subscription } from 'rxjs'
import { DeleteIcon } from './delete-icon'
import { IEdge } from './draw.service'
import { EdgeValidation } from './edge.validations'
import { Graph } from './graph'
import { Node } from './node'

export class Edge extends Konva.Group {
  static EDGE_COLOR = '#A5ACC0'

  public origin: Node
  public arrow: Arrow
  public circle: Circle
  public points: number[]
  private deleteIcon: DeleteIcon
  private hoverLine: Line
  private target: Node | null
  private nearTarget: Node | null
  private targetOnDrag: Subscription
  private targetOnDragEnd: Subscription
  private originOnDrag: Subscription
  private originOnDragEnd: Subscription
  private originMouseOver: Subscription
  private originMouseOut: Subscription
  private deleteIconClick: Subscription
  constructor(origin: Node, config: any = {}) {
    const defaults = {
      id: Graph.generateId(),
      ...config
    }
    super(defaults)
    this.origin = origin
    this.addArrow(config)
    this.addCircle()
    this.addHoverLine()
    this.addDeleteIcon()
    this.originOnDrag = this.origin.onDrag.subscribe(() => {
      this.onNodeDrag()
    })
    this.originOnDragEnd = this.origin.onDragEnd.subscribe(() => {
      this.onNodeDrag(true)
    })

    this.on('mouseover', () => {
      if (!Graph.getDrawService().isDrawing) {
        this.deleteIcon.show()
      }
      Graph.getDrawService().redrawCanvas()
    })

    this.on('mouseout', () => {
      this.deleteIcon.hide()
      Graph.getDrawService().redrawCanvas()
    })
    this.originMouseOver = this.origin.onMouseOver.subscribe(() => {
      this.setCircleZIndex(-3)
    })
    this.originMouseOut = this.origin.onMouseOut.subscribe(() => {
      if (!Graph.getDrawService().isDrawing) {
        this.setCircleZIndex(3)
      }
    })
  }

  public addEdgeAsData(target: Node): void {
    Graph.getDrawService().edges.push({
      id: this.id(),
      origin: this.origin.id(),
      target: target.id()
    })
  }

  public deleteEdgeAsData(): void {
    const drawService = Graph.getDrawService()
    const edgesArray = drawService.edges
    const edgeIndex = edgesArray.findIndex((el: IEdge) => el.id === this.id())
    if (edgeIndex > -1) edgesArray.splice(edgeIndex, 1)
  }

  public getOriginNode(): Node {
    return this.origin
  }

  public onNodeDrag(dragend?: boolean): void {
    if (this.target) {
      const p = this.origin.getArrowToNode(this.target, dragend)
      this.setAllPoints(p)
    }
  }

  public isNearTarget(nodes: Node[]): boolean {
    this.nearTarget = EdgeValidation.isNearATarget(this, nodes)
    this.nearTarget ? this.setLockStyle() : this.setDefaultStyle()
    return !!this.nearTarget
  }

  public setTarget(presetTarget?: Node): void {
    const target = presetTarget || this.nearTarget
    if (target) {
      this.setCircleZIndex(3)
      this.target = target
      this.addEdgeAsData(this.target)
      this.setAllPoints(this.origin.getArrowToNode(this.target, true))
      this.setDefaultStyle()
      this.targetOnDrag = this.target.onDrag.subscribe(() => {
        this.onNodeDrag()
      })
      this.targetOnDragEnd = this.target.onDragEnd.subscribe(() => {
        this.onNodeDrag(true)
      })
    }
  }

  public setAllPoints(points: number[]): void {
    this.points = points
    this.arrow.points(points)
    this.hoverLine.points(points)
    this.setDeleteIconPosition()
    this.setCirclePosition()
    Graph.getDrawService().redrawCanvas()
  }

  public delete(): void {
    this.unsubscribe()
    this.deleteEdgeAsData()
    this.circle.destroy()
    this.destroy()
    Graph.getDrawService().redrawCanvas()
  }

  private unsubscribe(): void {
    const subscriptions = [
      this.targetOnDrag,
      this.targetOnDragEnd,
      this.originOnDrag,
      this.originOnDragEnd,
      this.originMouseOver,
      this.originMouseOut,
      this.deleteIconClick
    ]
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) subscription.unsubscribe()
    })
  }

  private addArrow(config: any): void {
    const defaults = {
      fill: Edge.EDGE_COLOR,
      pointerLength: 8,
      pointerWidth: 8,
      stroke: Edge.EDGE_COLOR,
      strokeWidth: 1,
      ...config
    }
    this.arrow = new Arrow(defaults)
    this.add(this.arrow)
  }

  private addCircle(): void {
    const config = {
      fill: Edge.EDGE_COLOR,
      height: 9,
      radius: 9,
      width: 9
    }
    this.circle = new Circle(config)
    Graph.getLayer().add(this.circle)
  }
  private addHoverLine(): void {
    const config = {
      opacity: 0,
      points: this.arrow.points(),
      stroke: 'black',
      strokeWidth: 50
    }
    this.hoverLine = new Line(config)
    this.add(this.hoverLine)
  }
  private addDeleteIcon(): void {
    this.deleteIcon = new DeleteIcon()
    this.add(this.deleteIcon)
    this.deleteIconClick = this.deleteIcon.onClick.subscribe(() => {
      Graph.getGraphService().deleteEdgeById(this.id(), this.getStage())
    })
  }

  private setCirclePosition(): void {
    const x = this.points[0]
    const y = this.points[1]
    this.circle.x(x)
    this.circle.y(y)
    Graph.getDrawService().redrawCanvas()
  }

  private setCircleZIndex(zIndex: number): void {
    const originZIndex = this.origin.getZIndex() || 2
    this.circle.setZIndex(originZIndex + zIndex)
    Graph.getDrawService().redrawCanvas()
  }

  private setDeleteIconPosition(): void {
    const points = this.points
    const x =
      points[2] - (points[2] - points[0] + this.deleteIcon.getWidth()) / 2
    const y =
      points[3] - (points[3] - points[1] + this.deleteIcon.getWidth()) / 2
    this.deleteIcon.x(x)
    this.deleteIcon.y(y)
    Graph.getDrawService().redrawCanvas()
  }

  private setLockStyle(): void {
    this.arrow.fill('#835cdd')
    this.arrow.stroke('#835cdd')
  }

  private setDefaultStyle(): void {
    this.arrow.fill(Edge.EDGE_COLOR)
    this.arrow.stroke(Edge.EDGE_COLOR)
  }
}
