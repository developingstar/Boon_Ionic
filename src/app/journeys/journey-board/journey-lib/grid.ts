import Konva from 'konva'

const gridOffset = 20
const gridNumber = 20
const dotRadius = 1.6
const gridColor = 'rgb(235, 237, 245)'

export class Grid extends Konva.Layer {
  public stage: Konva.Stage
  public grid: Konva.Rect
  constructor(stage: Konva.Stage) {
    super()
    this.stage = stage
    this.addDots()
  }

  public addDots(): void {
    const gridWidth = this.stage.getWidth()
    const gridHeight = this.stage.getHeight()
    const dotsX = Math.round(gridWidth / gridNumber)
    const dotsY = Math.round(gridHeight / gridNumber)
    Array.from(Array(dotsX)).forEach((_, i) => {
      Array.from(Array(dotsY)).forEach((__, j) => {
        const x = Math.round(i * gridNumber) + gridOffset
        const y = Math.round(j * gridNumber) + gridOffset
        this.createDot(x, y)
      })
    })
  }

  public createDot(x: number, y: number): void {
    const dot = new Konva.Circle({
      draggable: false,
      fill: gridColor,
      radius: dotRadius,
      x: x,
      y: y
    })
    this.add(dot)
  }

  public resizeGrid(): void {
    this.destroyChildren()
    this.addDots()
  }
}
