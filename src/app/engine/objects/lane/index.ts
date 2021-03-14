import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'
import { Sheep } from '../sheep'

export class Lane implements IObject {
  private sheeples: Sheep[] = []
  private container: PIXI.Container
  private _width: number = 0
  private _height: number = 0

  constructor () {
    this.container = new PIXI.Container()
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }

  setSize (width: number, height: number) {
    this._width = width
    this._height = height
  }

  setPosition (x: number, y: number) {
    this.container.x = x
    this.container.y = y
  }

  spawnASheep (speed: number = 1, scale: number = 1) {
    const newSheep = new Sheep()
    const sheepWidth = (newSheep.width / newSheep.height) * this._height
    const scaledWidth = sheepWidth * scale
    const scaledHeight = this._height * scale
    newSheep.setPosition(this._width - this._height, this._height - scaledHeight)
    newSheep.setGroundPosition(this._height - scaledHeight)
    newSheep.setSize(scaledWidth, scaledHeight)
    newSheep.speed = speed
    this.sheeples.push(newSheep)
    newSheep.spawn(this.container)
  }

  herdTheSheep (delta: number) {
    const sheepsInBounds = []
    this.sheeples.forEach(sheep => {
      if (sheep.x <= 0) {
        sheep.despawn(this.container)
      } else {
        sheepsInBounds.push(sheep)
        sheep.update(delta)
      }
    })
    this.sheeples = sheepsInBounds
  }

  getSheepAtPoint (point: PIXI.Point) {
    return this.sheeples.find(sheep => {
      const rectArea = new PIXI.Rectangle(sheep.x, sheep.y, sheep.width, sheep.height)
      return rectArea.contains(point.x - this.x, point.y - this.y)
    })
  }

  get x () {
    return this.container.x
  }

  get y () {
    return this.container.y
  }

  get width () {
    return this._width
  }

  get height () {
    return this._height
  }
}
