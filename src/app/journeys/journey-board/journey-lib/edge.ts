import Konva, { Arrow, Group, Layer } from 'konva'

import { EdgeValidation } from './edge.validations'
import { Graph } from './graph'
import { Node } from './node'
import { NodeValidation } from './node.validations'

export class Edge extends Arrow {
  private origin: Node
  private target: Node | null
  private nearTarget: Node | null

  constructor(origin: Node, config: Konva.ArrowConfig) {
    // TODO:  create/use typings
    const defaults = {
      fill: 'grey',
      id: Math.random().toString(),
      pointerLength: 2,
      pointerWidth: 2,
      stroke: '#A5ACC0',
      strokeWidth: 2,
      ...config
    }
    super(defaults)
    this.origin = origin
    this.origin.onDrag.subscribe(() => {
      this.onNodeDrag()
    })
    this.origin.onDragEnd.subscribe(() => {
      this.onNodeDrag(true)
    })
  }

  public onNodeDrag(dragend?: boolean): void {
    if (this.target) {
      const p = this.origin.getArrowToNode(this.target, dragend)
      this.points(p)
      Graph.getDrawService().redrawCanvas()
    }
  }

  public arrowPosition(origin: Node, target: Node): any {
    return origin.getArrowToNode(target)
  }

  public getOriginNode(): Node {
    return this.origin
  }

  public isNearTarget(nodes: Node[]): boolean {
    this.nearTarget = EdgeValidation.isNearATarget(this, nodes)
    this.nearTarget ? this.setLockStyle() : this.setDefaultStyle()
    return !!this.nearTarget
  }

  public setTarget(presetTarget?: Node): void {
    const target = presetTarget || this.nearTarget
    if (target) {
      this.target = target
      this.addEdgeAsData(this.target)
      this.points(this.origin.getArrowToNode(this.target, true))
      this.setDefaultStyle()
      this.target.onDrag.subscribe(() => {
        this.onNodeDrag()
      })
      this.target.onDragEnd.subscribe(() => {
        this.onNodeDrag(true)
      })
    }
  }

  private addEdgeAsData(target: Node): void {
    Graph.getDrawService().edges.push({
      id: this.id(),
      origin: this.origin.id(),
      target: target.id()
    })
  }

  private setLockStyle(): void {
    this.fill('red')
    this.stroke('red')
    this.pointerLength(7)
    this.pointerWidth(7)
  }

  private setDefaultStyle(): void {
    this.fill('#A5ACC0')
    this.stroke('#A5ACC0')
    this.pointerLength(7)
    this.pointerWidth(7)
  }
}
