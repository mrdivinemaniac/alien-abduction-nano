import { IObject } from '../../core/iobject'

export class Hover {
  private object: IObject
  public speed: number = 0.07
  public distance: number = 3
  private hoverUp: boolean = true
  private baseY: number

  constructor (object: IObject) {
    this.object = object
    this.reset()
  }

  reset () {
    this.baseY = this.object.y
  }

  update (delta: number) {
    const absDist = Math.abs(this.object.y - this.baseY)
    if (absDist >= this.distance) this.hoverUp = !this.hoverUp
    const hoverDir = this.hoverUp ? -1 : 1
    this.object.setPosition(this.object.x, this.object.y + (hoverDir * this.speed * delta))
  }
}
