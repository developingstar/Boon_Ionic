import Konva, { Shape } from 'konva'
import { Subject } from 'rxjs'

import { DeleteIcon } from './delete-icon'
import { DrawPoint } from './draw-point'
import { INode } from './draw.service'
import { Edge } from './edge'
import { Graph } from './graph'
import { NodeValidation } from './node.validations'
import { Rectangle } from './rectangle'

export class Node extends Konva.Group {
  static MOUSEOVER_ZINDEX = 20
  onDrag: Subject<boolean> = new Subject()
  onDragEnd: Subject<boolean> = new Subject()

  private graph: Graph
  private baseRect: Rectangle
  private drawPoint: DrawPoint
  private deleteIcon: DeleteIcon
  // then create layer
  constructor(graph: Graph, config: any = {}) {
    super(config)
    this.baseRect = new Rectangle()
    this.drawPoint = new DrawPoint(this)
    this.deleteIcon = new DeleteIcon()
    this.add(this.baseRect)
    this.add(this.drawPoint)
    this.add(this.deleteIcon)
    this.graph = graph
    this.addNodeAsData()

    Graph.getDrawService().onDraw.subscribe(() => {
      this.draggable(false)
    })

    Graph.getDrawService().onDrawStop.subscribe(() => {
      this.draggable(true)
    })

    this.on('mouseover', () => {
      this.drawPoint.show()
      this.deleteIcon.show()
      if (!Graph.getDrawService().isDrawing) {
        this.setZIndex(Node.MOUSEOVER_ZINDEX)
      }
      Graph.getDrawService().redrawCanvas()
    })

    this.on('mouseout', () => {
      this.drawPoint.hide()
      this.deleteIcon.hide()
      Graph.getDrawService().redrawCanvas()
    })

    this.on('dragmove', () => {
      this.updateNodeDataCoordinates()
      this.onDrag.next(true)
    })

    this.on('dragend', () => {
      this.snapNode()
      this.onDragEnd.next(true)
    })
  }

  public getArrowToNode(target: Node, dragend?: boolean): number[] {
    NodeValidation.checkNodeSizes(this.getHeight(), this.getWidth())
    NodeValidation.checkNodeSizes(target.getHeight(), target.getWidth())
    let positions: number[] = []
    function calcSnapX(position: number): any {
      return dragend ? Graph.calcSnapX(position) : position
    }
    function calcSnapY(position: number): any {
      return dragend ? Graph.calcSnapY(position) : position
    }
    if (this.isLeftOf(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth(),
        calcSnapY(this.y()) + this.getHeight() / 2,
        calcSnapX(target.x()),
        calcSnapY(target.y()) + this.getHeight() / 2
      ]
    } else if (this.isRightOf(target)) {
      positions = [
        calcSnapX(this.x()),
        calcSnapY(this.y()) + this.getHeight() / 2,
        calcSnapX(target.x()) + target.width(),
        calcSnapY(target.y()) + target.height() / 2
      ]
    } else if (this.isCenterOver(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth() / 2,
        calcSnapY(this.y()),
        calcSnapX(target.x()) + target.width() / 2,
        calcSnapY(target.y()) + target.height()
      ]
    } else if (this.isCenterBelow(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth() / 2,
        calcSnapY(this.y()) + this.getHeight(),
        calcSnapX(target.x()) + target.width() / 2,
        calcSnapY(target.y())
      ]
    }
    return positions
  }

  public updateNodeDataCoordinates(): void {
    const updatedNode: INode = {
      id: this.id(),
      x: this.x(),
      y: this.y()
    }
    const nodesArray = Graph.getDrawService().nodes
    nodesArray[
      nodesArray.findIndex((el: INode) => el.id === updatedNode.id)
    ] = updatedNode
  }

  public isLeftOf(target: Konva.Node): boolean {
    return target.x() - this.x() > target.width() + 10
  }
  public isRightOf(target: Konva.Node): boolean {
    return target.x() - this.x() < -this.width() - 10
  }
  public isCenterOver(target: Konva.Node): boolean {
    return target.y() < this.y()
  }
  public isCenterBelow(target: Konva.Node): boolean {
    return target.y() > this.y()
  }

  public add(...children: Konva.Node[]): this {
    super.add(...children)
    let maxHeight: number = this.getHeight()
    let maxWidth: number = this.getWidth()
    children.forEach((child) => {
      if (child.height() && maxHeight < child.height())
        maxHeight = child.height()
      if (child.width() && maxWidth < child.width()) maxWidth = child.width()
    })
    this.height(maxHeight)
    this.width(maxWidth)
    return this
  }

  private addNodeAsData(): void {
    Graph.getDrawService().nodes.push({
      id: this.id(),
      x: this.x(),
      y: this.y()
    })
  }

  private snapNode(): void {
    this.position({
      x: Graph.calcSnapX(this.x()),
      y: Graph.calcSnapY(this.y())
    })
    Graph.getDrawService().redrawCanvas()
  }
}
