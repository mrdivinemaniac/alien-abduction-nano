import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Fence implements IObject {
  private sprite: PIXI.TilingSprite

  constructor () {
    const fenceTexture = PIXI.Texture.from(`fence.png`)
    this.sprite = new PIXI.TilingSprite(fenceTexture)
  }

  setSize (width: number, height: number) {
    this.sprite.width = width
    this.sprite.height = height
    const scale = height / this.sprite.texture.height
    this.sprite.tileScale.set(scale)
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
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
