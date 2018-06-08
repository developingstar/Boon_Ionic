import Konva, { Shape } from 'konva'
import { Subject } from 'rxjs'

import { DrawPoint } from './draw-point'
import { INode } from './draw.service'
import { Edge } from './edge'
import { Graph } from './graph'
import { NodeValidation } from './node.validations'
import { Rectangle } from './rectangle'

export class Node extends Konva.Group {
  onDrag: Subject<boolean> = new Subject()
  onDragEnd: Subject<boolean> = new Subject()

  private graph: Graph
  private baseRect: Rectangle
  private drawPoint: DrawPoint

  // then create layer
  constructor(graph: Graph, config: any = {}) {
    super(config)
    this.baseRect = new Rectangle()
    this.drawPoint = new DrawPoint(this)
    this.add(this.baseRect)
    this.add(this.drawPoint)
    this.graph = graph
    this.drawPoint.hide()
    Graph.getDrawService().nodes.push({
      id: this.id(),
      x: this.x(),
      y: this.y()
    })

    Graph.getDrawService().onDraw.subscribe(() => {
      this.draggable(false)
    })

    Graph.getDrawService().onDrawStop.subscribe(() => {
      this.draggable(true)
    })

    this.on('mouseover', () => {
      this.drawPoint.show()
      Graph.getDrawService().redrawCanvas()
    })

    this.on('mouseout', () => {
      this.drawPoint.hide()
      Graph.getDrawService().redrawCanvas()
    })

    this.on('dragmove', () => {
      this.updateNodeDataCoordinates()
      this.onDrag.next(true)
    })

    // TODO: this will work to make it snap in place, needs work to attach arrows correctly if used
    this.on('dragend', () => {
      const snapSize = 30
      this.position({
        x: Math.round(this.x() / snapSize) * snapSize,
        y: Math.round(this.y() / snapSize) * snapSize
      })
      Graph.getDrawService().redrawCanvas()
      this.onDragEnd.next(true)
    })
  }

  public getArrowToNode(target: Node, dragend?: boolean): number[] {
    NodeValidation.checkNodeSizes(this.getHeight(), this.getWidth())
    NodeValidation.checkNodeSizes(target.getHeight(), target.getWidth())
    let positions: number[] = []
    const snapSize = 30
    function calcPos(position: number): any {
      if (dragend) {
        return Math.round(position / snapSize) * snapSize
      } else {
        return position
      }
    }
    if (this.isLeftOf(target)) {
      positions = [
        calcPos(this.x()) + this.getWidth(),
        calcPos(this.y()) + this.getHeight() / 2,
        calcPos(target.x()),
        calcPos(target.y()) + this.getHeight() / 2
      ]
    } else if (this.isRightOf(target)) {
      positions = [
        calcPos(this.x()),
        calcPos(this.y()) + this.getHeight() / 2,
        calcPos(target.x()) + target.width(),
        calcPos(target.y()) + target.height() / 2
      ]
    } else if (this.isCenterOver(target)) {
      positions = [
        calcPos(this.x()) + this.getWidth() / 2,
        calcPos(this.y()),
        calcPos(target.x()) + target.width() / 2,
        calcPos(target.y()) + target.height()
      ]
    } else if (this.isCenterBelow(target)) {
      positions = [
        calcPos(this.x()) + this.getWidth() / 2,
        calcPos(this.y()) + this.getHeight(),
        calcPos(target.x()) + target.width() / 2,
        calcPos(target.y())
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
}
