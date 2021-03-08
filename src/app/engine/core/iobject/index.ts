import * as PIXI from 'pixi.js'

export interface IObject {
  setPosition (x: number, y: number) : void
  setSize (width: number, height: number) : void
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  spawn (container: PIXI.Container): void
}
