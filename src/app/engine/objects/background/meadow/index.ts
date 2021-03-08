import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Meadow implements IObject {
  private container: PIXI.Container
  private sprite: PIXI.TilingSprite
  private gradient: PIXI.Sprite

  constructor () {
    this.container = new PIXI.Container()
    const texture = PIXI.Texture.from(`textures/grass.png`)
    this.sprite = new PIXI.TilingSprite(texture)
    this.gradient = new PIXI.Sprite()
    this.sprite.tint = 0X33AA33
    this.gradient.alpha = 0.6
    this.container.addChild(this.sprite)
    this.container.addChild(this.gradient)
  }

  setPosition (x: number, y: number): void {
    this.container.x = x
    this.container.y = y
  }

  setSize (width: number, height: number): void {
    this.sprite.width = width
    this.sprite.height = height
    this.gradient.texture = createGrassGradient(width, height)
    this.sprite.width = width
    this.sprite.height = height
  }

  get width () {
    return this.container.width
  }

  get height () {
    return this.container.height
  }

  get x () {
    return this.container.x
  }

  get y () {
    return this.container.y
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }
}

function createGrassGradient (width: number, height: number) {
  // adjust it if somehow you need better quality for very very big images
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  // use canvas2d API to create gradient
  const grd = ctx.createLinearGradient(0, 0, 0, height)
  grd.addColorStop(0, '#00FF00')
  grd.addColorStop(0.15, '#00DD00')
  grd.addColorStop(0.3, '#00AA00')
  grd.addColorStop(0.7, '#006600')
  grd.addColorStop(1, '#004400')

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, width, height)

  return PIXI.Texture.from(canvas)
}
