import Konva, { Shape } from 'konva'
import { Subject } from 'rxjs'

import { DrawPoint } from './draw-point'
import { Edge } from './edge'
import { Graph } from './graph'
import { NodeValidation } from './node.validations'
import { Rectangle } from './rectangle'
import { INode } from './draw.service'

export class Node extends Konva.Group {
  onDrag: Subject<boolean> = new Subject()

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
      this.getLayer().draw()
    })

    this.on('mouseout', () => {
      this.drawPoint.hide()
      this.getLayer().draw()
    })

    this.on('dragmove', () => {
      this.updateNodeDataCoordinates()
      this.onDrag.next(true)
    })
  }

  public getArrowToNode(target: Node): number[] {
    NodeValidation.checkNodeSizes(this.getHeight(), this.getWidth())
    NodeValidation.checkNodeSizes(target.getHeight(), target.getWidth())
    let positions: number[] = []
    if (this.isLeftOf(target)) {
      positions = [
        this.x() + this.getWidth(),
        this.y() + this.getHeight() / 2,
        target.x(),
        target.y() + this.getHeight() / 2
      ]
    } else if (this.isRightOf(target)) {
      positions = [
        this.x(),
        this.y() + this.getHeight() / 2,
        target.x() + target.width(),
        target.y() + target.height() / 2
      ]
    } else if (this.isCenterOver(target)) {
      positions = [
        this.x() + this.getWidth() / 2,
        this.y(),
        target.x() + target.width() / 2,
        target.y() + target.height()
      ]
    } else if (this.isCenterBelow(target)) {
      positions = [
        this.x() + this.getWidth() / 2,
        this.y() + this.getHeight(),
        target.x() + target.width() / 2,
        target.y()
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
