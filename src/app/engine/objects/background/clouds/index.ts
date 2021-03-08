import * as PIXI from 'pixi.js'
import { randBetween } from '../../../../../utils'
import { IObject } from '../../../core/iobject'

export class Clouds implements IObject {
  private cloudTexture: PIXI.Texture
  private container: PIXI.Container
  private _width: number
  private _height: number
  private cellHeight: number
  private cellWidth: number
  private numRows: number
  private numCols: number
  public cloudChance = 0.15 // The chance that a cloud will be generated
  public density = 1 // Number of clouds that can be clumped together
  public cloudsSpeed = 0.1 // The speed with which the clouds move

  constructor () {
    this.container = new PIXI.Container()
    this.cloudTexture = PIXI.Texture.from('textures/cloud.png')
  }

  setSize (width: number, height: number) {
    this._width = width
    this._height = height
    const cellWidth = this.cloudTexture.width / this.density
    const cellHeight = this.cloudTexture.height / this.density
    const numCols = Math.floor((width - this.cloudTexture.width) / cellWidth)
    const numRows = Math.floor((height - this.cloudTexture.height) / cellHeight)
    this.cellHeight = cellHeight
    this.cellWidth = cellWidth
    this.numCols = numCols
    this.numRows = numRows
    for (let row = 0; row < numRows; ++row) {
      for (let col = 0; col < numCols; ++col) {
        this.randomlySpawnCloudAtPos(col, row)
      }
    }
  }

  get width () {
    return this._width
  }

  get height () {
    return this._height
  }

  get x () {
    return this.container.x
  }

  get y () {
    return this.container.y
  }

  setPosition (x: number, y: number) {
    this.container.x = x
    this.container.y = y
  }

  private randomlySpawnCloudAtPos (col: number, row: number) {
    const cloudLuck = Math.random() < this.cloudChance
    if (!cloudLuck) return
    const cloud = new PIXI.Sprite(this.cloudTexture)
    const cellStartX = col * this.cellWidth
    const cellStartY = row * this.cellHeight
    cloud.x = col === 0
      ? randBetween(-this.cellWidth * 1.5, -this.cellWidth)
      : randBetween(cellStartX, cellStartX + this.cellWidth)
    cloud.y = randBetween(cellStartY, cellStartY + this.cellHeight)
    const scale = randBetween(0.3, 1)
    cloud.scale.set(scale, scale)
    this.container.addChild(cloud)
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }

  wander (delta: number) {
    let minX = this._width
    const clouds = [...this.container.children]
    for (let i = 0; i < clouds.length; ++i) {
      const child = clouds[i] as PIXI.Sprite
      if (child.x >= this._width + child.width) {
        this.container.removeChild(child)
      } else {
        child.x += this.cloudsSpeed * delta
        if (child.x < minX) minX = child.x
      }
    }

    if (minX > this.cellWidth) {
      for (let i = 0; i < this.numRows; ++i) {
        this.randomlySpawnCloudAtPos(0, i)
      }
    }
  }
}
