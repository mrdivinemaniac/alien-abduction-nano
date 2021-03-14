import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'

export class MoveTowards {
  private object: IObject
  public target?: PIXI.Point
  public speed: number = 1

  constructor (object: IObject) {
    this.object = object
  }

  update (delta: number) {
    if (!this.target) return false
    const targetX = this.target.x - this.object.width / 2
    const targetY = this.target.y - this.object.height / 2
    const distX = targetX - this.object.x
    const distY = targetY - this.object.y
    if (distX === 0 && distY === 0) return false
    const snapDist = this.speed
    const dirX = distX > 0 ? 1 : -1
    const dirY = distY > 0 ? 1 : -1
    const newX = Math.abs(distX) >= snapDist
      ? this.object.x + (this.speed * dirX * delta)
      : targetX
    const newY = Math.abs(distY) >= snapDist
      ? this.object.y + (this.speed * dirY * delta)
      : targetY
    this.object.setPosition(newX, newY)
    return true
  }
}
