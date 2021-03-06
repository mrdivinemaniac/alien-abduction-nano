import * as PIXI from 'pixi.js'
import sound from 'pixi-sound'
import { IObject } from '../../core/iobject'
import { Hover } from '../../scripts/hover/hover'
import { soundControl } from '../../sounds'

const STATE = {
  MOVING: 1,
  STOPPED: 2,
  FLOATING_UP: 3,
  FLOATING: 4,
  FLOATING_DOWN: 5
}
export class Sheep implements IObject {
  static sounds = {
    floatUp: sound.Sound.from({
      url: 'sounds/sheep-liftoff.flac',
      preload: true,
      volume: 0.2
    }),
    bleet1: sound.Sound.from({
      url: 'sounds/sheep-bleet-1.flac',
      preload: true,
      volume: 0.2
    }),
    bleet2: sound.Sound.from({
      url: 'sounds/sheep-bleet-2.flac',
      preload: true,
      volume: 0.2
    }),,
    floatDown: sound.Sound.from({
      url: 'sounds/sheep-dropped.flac',
      preload: true,
      volume: 0.2
    })
  }
  private sprite: PIXI.AnimatedSprite
  private _speed: number
  private _floatHeight: number = 0
  private _groundY: number = 0
  public _floatSpeed = 4
  private hoverer: Hover
  private state = STATE.MOVING
  public description: string
  public link: string

  constructor (description: string, link: string) {
    this.sprite = new PIXI.AnimatedSprite([
      PIXI.Texture.from(`sheep-walk-1.png`),
      PIXI.Texture.from(`sheep-walk-2.png`)
    ])
    this.description = description
    this.link = link
    this.speed = 1
    this.hoverer = new Hover(this)
    this.hoverer.distance = 1
    this.hoverer.speed = 0.03
  }

  setSize (width: number, height: number) {
    this.sprite.width = width
    this.sprite.height = height
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  setGroundPosition (y: number) {
    this._groundY = y
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

  startMoving () {
    this.sprite.play()
    if (this.state !== STATE.STOPPED && this.state !== STATE.MOVING) {
      soundControl.play(Sheep.sounds.floatDown)
      this.state = STATE.FLOATING_DOWN
    } else {
      this.state = STATE.MOVING
    }
  }

  stopMoving () {
    this.sprite.gotoAndStop(1)
    this.state = STATE.STOPPED
  }

  float (floatHeight: number) {
    soundControl.play(Sheep.sounds.floatUp)
    this.sprite.gotoAndStop(1)
    this.state = STATE.FLOATING_UP
    this._floatHeight = floatHeight
  }

  lockTarget () {
    const sepiaFilter = new PIXI.filters.ColorMatrixFilter()
    sepiaFilter.sepia(true)
    this.sprite.filters = [sepiaFilter]
  }

  unlockTarget () {
    this.sprite.filters = []
  }

  spawn (container: PIXI.Container) {
    const randNum = Math.random()
    const doTheBleet = randNum < 0.1
    if (doTheBleet) {
      const sound = randNum < 0.05 ? Sheep.sounds.bleet1 : Sheep.sounds.bleet2
      soundControl.play(sound)
    }
    this.sprite.play()
    container.addChild(this.sprite)
  }

  despawn (container: PIXI.Container) {
    this.sprite.stop()
    container.removeChild(this.sprite)
  }

  update (delta: number) {
    const distFromGround = this._groundY - this.sprite.y
    const percentFloated = (distFromGround / this._floatHeight) * 2
    if (this.state === STATE.FLOATING_UP) {
      // Move up if floating
      if (this.sprite.y > (this._groundY - this._floatHeight)) {
        this.sprite.y -= (this._floatSpeed + (this._floatSpeed * percentFloated)) * delta
      } else {
        this.state = STATE.FLOATING
        this.hoverer.reset()
      }
    } else if (this.state === STATE.FLOATING) {
      this.hoverer.update(delta)
    } else if (this.state === STATE.FLOATING_DOWN) {
      const speed = (this._floatSpeed + (this._floatSpeed * percentFloated))
      if (distFromGround >= speed) {
        this.sprite.y += speed * delta
      } else {
        this.sprite.y = this._groundY
        this.state = STATE.MOVING
      }
    } else if (this.state === STATE.MOVING) {
      this.sprite.x -= this._speed * delta
    }
  }

  containsPoint (point: PIXI.Point) {
    const bounds = new PIXI.Rectangle(this.x, this.y, this.width, this.height)
    return bounds.contains(point.x, point.y)
  }
}
