import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Sky implements IObject {
  private sprite: PIXI.Sprite

  constructor () {
    this.sprite = new PIXI.Sprite()
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  setSize (width: number, height: number) {
    this.sprite.texture = createSkyGradient(width, height)
  }

  get width () {
    return this.sprite.width
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
}

function createSkyGradient (width: number, height: number) {
  // adjust it if somehow you need better quality for very very big images
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  // use canvas2d API to create gradient
  const grd = ctx.createLinearGradient(0, 0, 0, height)
  grd.addColorStop(0, '#96d8e8')
  grd.addColorStop(0.15, '#96d8e8')
  grd.addColorStop(1, '#FFFFFF')

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, width, height)

  return PIXI.Texture.from(canvas)
}
