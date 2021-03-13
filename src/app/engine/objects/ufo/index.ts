import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'

export class UFO implements IObject {
  private sprite: PIXI.Sprite
  public speed: number = 5
  public hoverSpeed: number = 0.07
  public hoverDistance: number = 3
  private hoverUp: boolean = true

  constructor () {
    const texture = PIXI.Texture.from('textures/ufo.png')
    this.sprite = new PIXI.Sprite(texture)
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

  moveTowards (delta: number, x: number, y: number) {
    const targetX = x - this.width / 2
    const targetY = y - this.height / 2
    const distX = targetX - this.sprite.x
    const distY = targetY - this.sprite.y
    const snapXDist = this.speed
    const snapYDist = Math.max(this.speed, this.hoverDistance + 1)
    // Move towards cursor in X Axis
    if (Math.abs(distX) >= snapXDist) {
      const dir = distX > 0 ? 1 : -1
      this.sprite.x += this.speed * dir * delta
      // Snap to cursor X position if nearby
      if (Math.abs(this.sprite.x - targetX) <= snapXDist) this.sprite.x = targetX
    }
    // Move towards cursor in Y Axis
    if (Math.abs(distY) >= snapYDist) {
      const dir = distY > 0 ? 1 : -1
      this.sprite.y += this.speed * dir * delta
      // Snap to cursor Y position if nearby
      if (Math.abs(this.sprite.y - targetY) <= snapYDist) this.sprite.y = targetY
    } else {
      // If ufo didn't move vertically, play the hover animation
      const absDist = Math.abs(this.sprite.y - targetY)
      if (absDist > this.hoverDistance) this.hoverUp = !this.hoverUp
      const hoverDir = this.hoverUp ? -1 : 1
      this.sprite.y += hoverDir * this.hoverSpeed * delta
    }    
  }
}
