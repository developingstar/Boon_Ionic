import { IEdge } from './draw.service'
import { Edge } from './edge'
import { Graph } from './graph'
import { Node } from './node'
import { NodeValidation } from './node.validations'

export class EdgeValidation {
  static isNearATarget(edge: Edge, targets: Node[]): Node | null {
    for (const target of targets) {
      NodeValidation.checkNodeSizes(target.height(), target.width())
      let isNear = EdgeValidation.isNearNode(edge, target)
      if (target === edge.getOriginNode()) isNear = false // doesn't need to know if near 'self'
      if (isNear) {
        if (!this.doesEdgeAlreadyExist(edge, target)) return target
      }
    }
    return null
  }
  private static MIN_NEAR_DISTANCE = 20

  private static doesEdgeAlreadyExist(edge: Edge, target: Node): any {
    const edgesArray = Graph.getDrawService().edges
    const sameEdge = edgesArray.find((singleEdge: IEdge) => {
      return (
        singleEdge.origin === edge.origin.id() &&
        singleEdge.target === target.id()
      )
    })
    return sameEdge
  }

  private static isNearNode(edge: Edge, target: Node): boolean {
    const ex = edge.points[2]
    const ey = edge.points[3]
    const tx = target.x()
    const ty = target.y()
    return (
      ex > tx - this.MIN_NEAR_DISTANCE &&
      ex < tx + target.width() + this.MIN_NEAR_DISTANCE &&
      ey > ty - this.MIN_NEAR_DISTANCE &&
      ey < ty + target.height() + this.MIN_NEAR_DISTANCE
    )
  }
}
