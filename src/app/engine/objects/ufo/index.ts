import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'
import { Hover } from '../../scripts/hover/hover'
import { MoveTowards } from '../../scripts/move-towards'
import { TractorBeam } from './tractor-beam'

const STATE = {
  MOVING: 1,
  HOVERING: 2
}

export class UFO implements IObject {
  private sprite: PIXI.Sprite
  private speed: number = 5
  private mover: MoveTowards
  private hoverer: Hover
  private tractorBeam: TractorBeam
  private state: number = STATE.HOVERING

  constructor () {
    const texture = PIXI.Texture.from('textures/ufo.png')
    this.sprite = new PIXI.Sprite(texture)
    this.mover = new MoveTowards(this)
    this.mover.speed = this.speed
    this.hoverer = new Hover(this)
    this.tractorBeam = new TractorBeam()
    this.tractorBeam.visible = false
    this.syncTractorBeam()
  }

  setPosition(x: number, y: number): void {
    this.sprite.x = x
    this.sprite.y = y
    this.syncTractorBeam()
  }

  setSize(width: number, height: number): void {
    this.sprite.width = width
    this.sprite.height = height
    this.tractorBeam.setSize(this.sprite.width * 0.5, this.tractorBeam.height)
    this.syncTractorBeam()
  }

  private syncTractorBeam () {
    this.tractorBeam.setPosition(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height - 10
    )
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
    this.tractorBeam.spawn(container)
    container.addChild(this.sprite)
  }

  update (delta: number) {
    this.tractorBeam.update(delta)
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

  engageTractorBeam (height: number) {
    this.tractorBeam.setSize(this.tractorBeam.width, height)
    this.tractorBeam.visible = true
  }

  disengageTractorBeam () {
    this.tractorBeam.visible = false
  }

  isHovering () {
    return this.state === STATE.HOVERING
  }
}
