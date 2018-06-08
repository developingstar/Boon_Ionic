import Konva from 'konva'
import { NodeValidation } from './node.validations'
import { Graph } from './graph'

export class DeleteIcon extends Konva.Image {
  static BASE_HEIGHT = 20
  static BASE_WIDTH = 20
  // then create layer
  constructor() {
    const imageObj = new Image()
    imageObj.src = '/assets/remove.svg'
    const defaults: Konva.ImageConfig = {
      height: DeleteIcon.BASE_HEIGHT,
      image: imageObj,
      visible: false,
      width: DeleteIcon.BASE_WIDTH,
      x: 0,
      y: 0
    }
    super(defaults)

    this.on('mouseenter', () => {
      this.getStage().container().style.cursor = 'pointer'
    })
    this.on('mouseleave', () => {
      this.getStage().container().style.cursor = 'default'
    })
  }
}
