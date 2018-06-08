import { Shape } from 'konva'
import { Subject } from 'rxjs'

export class DrawService {
  isDrawing: boolean = false
  mouseDown: boolean = false
  onDraw: Subject<IOnDraw> = new Subject()
  onDrawStop: Subject<boolean> = new Subject()
  onLayerDraw: Subject<boolean> = new Subject()
  nodes: INode[] = []
  edges: IEdge[] = []

  public startDrawing(data: IOnDraw): void {
    this.isDrawing = true
    this.mouseDown = true
    this.onDraw.next(data)
  }

  public stopDrawing(): void {
    this.isDrawing = false
    this.mouseDown = false
    this.onDrawStop.next(true)
  }

  public redrawCanvas(): void {
    this.onLayerDraw.next(true)
  }
}

// tslint:disable-next-line:interface-name
export interface IOnDraw {
  shape: Shape | null
  x: number
  y: number
}

export interface INode {
  id: string
  x: number
  y: number
}

export interface IEdge {
  id: string
  origin: string
  target: string
}
