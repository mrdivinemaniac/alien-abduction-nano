import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Windmill implements IObject {
  private baseSprite: PIXI.Sprite
  private bladesContainer: PIXI.Container

  constructor () {
    const base = PIXI.Texture.from(`windmill-base.png`)
    const blades = PIXI.Texture.from(`windmill-blades.png`)
    this.baseSprite = PIXI.Sprite.from(base)
    const bladesSprite1 = PIXI.Sprite.from(blades)
    const bladesSprite2 = PIXI.Sprite.from(blades)

    bladesSprite1.anchor.set(0.5)
    bladesSprite1.rotation = Math.PI / 2
    bladesSprite2.anchor.set(0.5)
    bladesSprite2.rotation = Math.PI

    this.bladesContainer = new PIXI.Container()
    this.bladesContainer.addChild(bladesSprite1)
    this.bladesContainer.addChild(bladesSprite2)  
  }

  private repositionBlades () {
    this.bladesContainer.x = this.baseSprite.x + this.baseSprite.width * 0.5
    this.bladesContainer.y = this.baseSprite.y + this.baseSprite.height * 0.2
  }

  setPosition (x: number, y: number) {
    this.baseSprite.x = x
    this.baseSprite.y = y
    this.repositionBlades()
  }

  setSize (width: number, height: number) {
    this.baseSprite.width = width
    this.baseSprite.height = height
    const scale = width / this.baseSprite.texture.width 
    this.bladesContainer.scale.set(scale, scale)
    this.repositionBlades()
  }

  get width () {
    return this.baseSprite.width
  }

  get height () {
    return this.baseSprite.height
  }

  get x () {
    return this.baseSprite.x
  }

  get y () {
    return this.baseSprite.y
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.bladesContainer)
    container.addChild(this.baseSprite)
  }

  rotate (delta: number) {
    this.bladesContainer.rotation -= 0.01 * delta
  }
}
