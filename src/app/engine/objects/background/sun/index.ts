import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Sun implements IObject {
  private sprite: PIXI.Sprite

  constructor () {
    const sunTexture = PIXI.Texture.from('textures/sun.png')
    this.sprite = new PIXI.Sprite(sunTexture)
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  setSize (width: number, height: number) {
    this.sprite.width = width
    this.sprite.height = height
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.sprite)
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
}
