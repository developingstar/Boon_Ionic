import Konva from 'konva'
import { Subject } from 'rxjs'

export class DeleteIcon extends Konva.Image {
  static BASE_HEIGHT = 16
  static BASE_WIDTH = 14
  onClick: Subject<boolean>

  constructor(config: any = {}) {
    const imageObj = new Image()
    imageObj.src = '/assets/icon/journey/delete.svg'
    const defaults: Konva.ImageConfig = {
      height: DeleteIcon.BASE_HEIGHT,
      image: imageObj,
      visible: false,
      width: DeleteIcon.BASE_WIDTH,
      x: 0,
      y: 0,
      ...config
    }
    super(defaults)
    this.onClick = new Subject()

    this.on('click', () => {
      this.onClick.next(true)
    })
    this.on('mouseenter', () => {
      this.getStage().container().style.cursor = 'pointer'
    })
    this.on('mouseleave', () => {
      if (this.getStage()) {
        this.getStage().container().style.cursor = 'default'
      }
    })
  }
}
