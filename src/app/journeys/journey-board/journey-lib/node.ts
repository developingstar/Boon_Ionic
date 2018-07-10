import Konva from 'konva'
import { Subject, Subscription } from 'rxjs'
import { ActionType, TriggerType } from '../../journeys.api.model'

import { DeleteIcon } from './delete-icon'
import { DrawPoint } from './draw-point'
import { INode } from './draw.service'
import { Graph } from './graph'
import { INodeData } from './graph.service'
import { NodeImage } from './node-image'
import { NodeValidation } from './node.validations'
import { Rectangle } from './rectangle'

export class Node extends Konva.Group {
  static MOUSEOVER_ZINDEX = 20
  onDrag: Subject<boolean> = new Subject()
  onDragEnd: Subject<boolean> = new Subject()
  onMouseOver: Subject<boolean> = new Subject()
  onMouseOut: Subject<boolean> = new Subject()
  onDelete: Subject<void> = new Subject()
  public drawPoint: DrawPoint
  public type: 'action' | 'trigger'
  public kind: TriggerType | ActionType
  public nodeData: INodeData
  public nodeDetails: Konva.Text
  private baseRect: Rectangle
  private deleteIcon: DeleteIcon
  private nodeImage: NodeImage
  private deleteIconClick: Subscription
  private nodeTitle: Konva.Text

  constructor(config: any = {}, nodeData: INodeData) {
    super(config)
    this.nodeData = nodeData
    this.type = nodeData.type
    this.kind = nodeData.kind
    this.baseRect = new Rectangle()
    this.drawPoint = new DrawPoint(this)
    this.deleteIcon = new DeleteIcon({ x: 3, y: 3 })

    this.add(this.baseRect)
    this.add(this.drawPoint)
    this.add(this.deleteIcon)
    this.addNodeAsData()
    this.addNodeImage()
    this.addNodeTitle()
    this.addNodeDetails()

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
      this.onMouseOver.next(true)
    })

    this.on('mouseout', () => {
      this.drawPoint.hide()
      this.deleteIcon.hide()
      Graph.getDrawService().redrawCanvas()
      this.onMouseOut.next(true)
    })

    this.on('dragmove', () => {
      this.updateNodeDataCoordinates()
      this.onDrag.next(true)
    })

    this.on('dragend', () => {
      this.snapNode()
      this.onDragEnd.next(true)
    })

    this.on('click', () => {
      Graph.getGraphService().onNodeClick.next(this)
    })

    this.deleteIconClick = this.deleteIcon.onClick.subscribe(() => {
      Graph.getGraphService().deleteNode(this)
    })
  }
  public updateDetails(details: string): void {
    this.nodeDetails.text(details)
    this.nodeDetails.x(this.getWidth() / 2 - this.nodeDetails.getWidth() / 2)
    Graph.getDrawService().redrawCanvas()
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
    const arrowHeadDist = 3
    if (this.isLeftOf(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth(),
        calcSnapY(this.y()) + this.getHeight() / 2,
        calcSnapX(target.x()) - arrowHeadDist,
        calcSnapY(target.y()) + this.getHeight() / 2
      ]
    } else if (this.isRightOf(target)) {
      positions = [
        calcSnapX(this.x()),
        calcSnapY(this.y()) + this.getHeight() / 2,
        calcSnapX(target.x()) + target.width() + arrowHeadDist,
        calcSnapY(target.y()) + target.height() / 2
      ]
    } else if (this.isCenterOver(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth() / 2,
        calcSnapY(this.y()),
        calcSnapX(target.x()) + target.width() / 2,
        calcSnapY(target.y()) + target.height() + arrowHeadDist
      ]
    } else if (this.isCenterBelow(target)) {
      positions = [
        calcSnapX(this.x()) + this.getWidth() / 2,
        calcSnapY(this.y()) + this.getHeight(),
        calcSnapX(target.x()) + target.width() / 2,
        calcSnapY(target.y()) - arrowHeadDist
      ]
    }
    return positions
  }

  public updateNodeDataCoordinates(): void {
    const updatedNode: INode = {
      data: this.nodeData,
      id: this.id(),
      x: this.x(),
      y: this.y()
    }
    const nodesArray = Graph.getDrawService().nodes
    nodesArray[
      nodesArray.findIndex((el: INode) => el.id === updatedNode.id)
    ] = updatedNode
  }

  public deleteNodeAsData(): void {
    const nodesArray = Graph.getDrawService().nodes
    const nodeIndex = nodesArray.findIndex((el: INode) => el.id === this.id())
    if (nodeIndex > -1) nodesArray.splice(nodeIndex, 1)
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

  public delete(): void {
    this.unsubscribe()
    this.deleteNodeAsData()
    this.deleteFromNodeArray()
    this.onDelete.next()
    this.destroy()
    Graph.getDrawService().redrawCanvas()
  }

  private addNodeAsData(): void {
    Graph.getDrawService().nodes.push({
      data: this.nodeData,
      id: this.id(),
      x: this.x(),
      y: this.y()
    })
  }

  private addNodeImage(): void {
    const imageObj = new Image()
    imageObj.onload = () => {
      this.nodeImage = new NodeImage({
        image: imageObj,
        x: this.getWidth() / 2 - NodeImage.BASE_WIDTH / 2,
        y: 10
      })
      this.add(this.nodeImage)
      Graph.getDrawService().redrawCanvas()
    }
    imageObj.src = this.iconPath
  }
  private addNodeTitle(): void {
    this.nodeTitle = new Konva.Text({
      fill: '#90A4AE',
      fontFamily: 'acumin-pro',
      fontSize: 11,
      fontStyle: '500',
      text: this.title,
      y: this.getHeight() / 2 + 7
    })
    this.nodeTitle.x(this.getWidth() / 2 - this.nodeTitle.getWidth() / 2)
    this.add(this.nodeTitle)
  }

  private addNodeDetails(): void {
    this.nodeDetails = new Konva.Text({
      align: 'center',
      fill: '#B5C4D1',
      fontFamily: 'acumin-pro',
      fontSize: 10,
      fontStyle: '500',
      text: '',
      width: this.getWidth() - 10,
      y: this.nodeTitle.y() + 15
    })
    this.nodeDetails.x(this.getWidth() / 2 - this.nodeDetails.getWidth() / 2)
    this.add(this.nodeDetails)
  }

  private deleteFromNodeArray(): void {
    const nodeArray = Graph.getGraphService().nodes
    const nodeIndex = nodeArray.findIndex((el: Node) => el.id() === this.id())
    if (nodeIndex > -1) nodeArray.splice(nodeIndex, 1)
  }

  private snapNode(): void {
    this.position({
      x: Graph.calcSnapX(this.x()),
      y: Graph.calcSnapY(this.y())
    })
    Graph.getDrawService().redrawCanvas()
  }

  private unsubscribe(): void {
    const subscriptions = [this.deleteIconClick]
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) subscription.unsubscribe()
    })
  }

  get iconPath(): string {
    return `assets/icon/journey/${this.type}s/${this.kind}.svg`
  }

  get title(): string {
    return this.kind.replace(/\_/g, ' ')
  }
}
