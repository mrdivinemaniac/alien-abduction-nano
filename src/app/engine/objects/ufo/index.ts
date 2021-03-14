import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'
import { Hover } from '../../scripts/hover/hover'
import { MoveTowards } from '../../scripts/move-towards'

const STATE = {
  MOVING: 1,
  HOVERING: 2
}

export class UFO implements IObject {
  private sprite: PIXI.Sprite
  private speed: number = 5
  private mover: MoveTowards
  private hoverer: Hover
  private state: number = STATE.HOVERING

  constructor () {
    const texture = PIXI.Texture.from('textures/ufo.png')
    this.sprite = new PIXI.Sprite(texture)
    this.mover = new MoveTowards(this)
    this.mover.speed = this.speed
    this.hoverer = new Hover(this)
  }

  setPosition(x: number, y: number): void {
    this.sprite.x = x
    this.sprite.y = y
  }

  setSize(width: number, height: number): void {
    this.sprite.width = width
    this.sprite.height = height
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

  spawn(container: PIXI.Container) {
    container.addChild(this.sprite)
  }

  update (delta: number) {
    if (this.state === STATE.MOVING) {
      const moved = this.mover.update(delta)
      if (!moved) {
        this.state = STATE.HOVERING
        this.hoverer.reset()
      }
    } else if (this.state === STATE.HOVERING) {
      this.hoverer.update(delta)
    }
  }

  moveTowards (target: PIXI.Point) {
    if (this.mover.target && this.mover.target.equals(target)) return
    this.mover.target = target
    this.state = STATE.MOVING
  }

  isHovering () {
    return this.state === STATE.HOVERING
  }
}
