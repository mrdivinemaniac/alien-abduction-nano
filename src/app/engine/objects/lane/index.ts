import * as PIXI from 'pixi.js'
import { IObject } from '../../core/iobject'
import { Sheep } from '../sheep'

export class Lane implements IObject {
  private sheeples: Sheep[] = []
  private container: PIXI.Container
  private width: number
  private height: number

  constructor () {
    this.container = new PIXI.Container()
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }

  setSize (width: number, height: number) {
    this.width = width
    this.height = height
  }

  setPosition (x: number, y: number) {
    this.container.x = x
    this.container.y = y
  }

  spawnASheep (speed: number = 1) {
    const newSheep = new Sheep()
    const sheepHeight = (newSheep.width / newSheep.height) * this.height
    newSheep.setPosition(this.width - this.height, 0)
    newSheep.setSize(sheepHeight, this.height)
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
}
