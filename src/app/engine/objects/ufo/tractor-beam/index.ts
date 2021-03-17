import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class TractorBeam implements IObject {
  private sprite: PIXI.Sprite
  public visible: boolean = true
  private targetWidth: number = 0

  constructor () {
    this.sprite = new PIXI.Sprite()
    this.sprite.filters = [new PIXI.filters.AlphaFilter(0.3)]
    this.sprite.width = 0
    this.sprite.anchor.set(0.5, 0)
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  setSize (width: number, height: number) {
    this.sprite.texture = createGradient(width, height)
    this.targetWidth = width
  }

  get width () {
    return this.targetWidth
  }

  get height () {
    return this.sprite.height
  }

  get x () {
    return this.sprite.x
  }

  get y () {
    return this.sprite.y
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.sprite)
  }

  update (delta: number) {
    if (this.visible) {
      if (this.sprite.width < this.targetWidth) {
        const speed = this.targetWidth * 0.05
        this.sprite.width += speed * delta
        if ((this.sprite.width - this.targetWidth) >= speed) {
          this.sprite.width = this.targetWidth
        }
      }
    } else {
      if (this.sprite.width > 0) {
        const speed = this.targetWidth * 0.05
        this.sprite.width -= speed * delta
        if (this.sprite.width <= speed) this.sprite.width = 0
      }
    }
  }
}

function createGradient (width: number, height: number) {
  // adjust it if somehow you need better quality for very very big images
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  // use canvas2d API to create gradient
  const grd = ctx.createLinearGradient(0, height/2, width, height/2)
  grd.addColorStop(0, '#96d8e8')
  grd.addColorStop(0.5, '#dddddd')
  grd.addColorStop(1, '#96d8e8')

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, width, height)

  return PIXI.Texture.from(canvas)
}
