import * as PIXI from 'pixi.js'
import { Sheep } from '../sheep'

export class Lane {
  private sheeples: Sheep[] = []
  private container: PIXI.Container = new PIXI.Container()
  private dims: PIXI.Point

  spawn (
    container: PIXI.Container,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.container.x = x
    this.container.y = y
    this.dims = new PIXI.Point(width, height)
    container.addChild(this.container)
  }

  get isFull () {
    return this.sheeples.length >= (this.dims.x / this.dims.y)
  }

  spawnASheep (speed: number = 1) {
    const newSheep = new Sheep(this.dims.y, this.dims.y, this.dims.x - this.dims.y, 0)
    newSheep.setSpeed(speed)
    this.sheeples.push(newSheep)
    newSheep.spawn(this.container)
  }

  herdTheSheep (delta: number) {
    const sheepsInBounds = []
    this.sheeples.forEach(sheep => {
      const currentPos = sheep.getPosition()
      if (currentPos.x <= 0) {
        sheep.despawn(this.container)
      } else {
        sheepsInBounds.push(sheep)
        sheep.move(delta)
      }
    })
    this.sheeples = sheepsInBounds
  }
}
