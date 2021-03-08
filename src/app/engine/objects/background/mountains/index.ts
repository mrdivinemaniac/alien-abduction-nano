import * as PIXI from 'pixi.js'
import { IObject } from '../../../core/iobject'

export class Mountains implements IObject {
  private container: PIXI.Container
  private mountainsFront: PIXI.TilingSprite
  private mountainsBack: PIXI.TilingSprite

  constructor () {
    this.container = new PIXI.Container()
    const mountainFrontTexture = PIXI.Texture.from(`mountains-front.png`)
    const mountainBackTexture = PIXI.Texture.from(`mountains-back.png`)

    this.mountainsFront = new PIXI.TilingSprite(mountainFrontTexture)
    this.mountainsBack = new PIXI.TilingSprite(mountainBackTexture)

    this.container.addChild(this.mountainsBack)
    this.container.addChild(this.mountainsFront)
  }

  setPosition (x: number, y: number) {
    this.container.x = x
    this.container.y = y
  }

  setSize (width: number, height: number) {
    const { mountainsFront, mountainsBack } = this
    const frontScale = height / mountainsFront.texture.height
    const backScale = height / mountainsBack.texture.height
    mountainsFront.width = width
    mountainsFront.height = height
    mountainsBack.width = width
    mountainsBack.height = height
    mountainsFront.tileScale.set(frontScale)
    mountainsBack.tileScale.set(backScale)
  }

  get width () {
    return this.container.width
  }

  get height () {
    return this.container.height
  }

  get x () {
    return this.container.x
  }

  get y () {
    return this.container.y
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }
}
