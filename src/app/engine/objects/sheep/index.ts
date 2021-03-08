import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'
export class Sheep implements IObject {
  private sprite: PIXI.AnimatedSprite
  private _speed: number

  constructor () {
    this.sprite = new PIXI.AnimatedSprite([
      PIXI.Texture.from(`sheep-walk-1.png`),
      PIXI.Texture.from(`sheep-walk-2.png`)
    ])
    this.sprite.anchor.x = 0
    this.sprite.anchor.y = 0
    this.speed = 1
  }

  setSize (width: number, height: number) {
    this.sprite.width = width
    this.sprite.height = height
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  get x () {
    return this.sprite.x
  }

  get y () {
    return this.sprite.y
  }

  get width () {
    return this.sprite.width
  }

  get height () {
    return this.sprite.height
  }

  set speed (value: number) {
    this._speed = value
    this.sprite.animationSpeed = 0.08 * value
  }

  spawn (container: PIXI.Container) {
    this.sprite.play()
    container.addChild(this.sprite)
  }

  despawn (container: PIXI.Container) {
    this.sprite.stop()
    container.removeChild(this.sprite)
  }

  update (delta: number) {
    this.sprite.x -= this._speed * delta
  }
}
