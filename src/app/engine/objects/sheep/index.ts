import * as PIXI from 'pixi.js'

export class Sheep {
  private sprite: PIXI.AnimatedSprite = new PIXI.AnimatedSprite(getTextures())
  private speed: number = 1

  constructor (width: number, height: number, x:number, y: number) {
    this.sprite.anchor.x = 0
    this.sprite.anchor.y = 0
    this.setDims(width, height)
    this.setPosition(x, y)
    this.setSpeed(1)
    this.sprite.play()
  }

  setDims (width: number, height: number) {
    this.sprite.width = width
    this.sprite.height = height
  }

  setPosition (x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  getPosition () {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  setSpeed (speed) {
    this.speed = speed
    this.sprite.animationSpeed = 0.08 * this.speed
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.sprite)
  }

  despawn (container: PIXI.Container) {
    container.removeChild(this.sprite)
  }

  move (delta: number) {
    this.sprite.x -= this.speed * delta
  }
}

let textures: PIXI.Texture[]

function getTextures () {
  if (!textures) {
    textures = [
      PIXI.Texture.from(`sheep-walk-1.png`),
      PIXI.Texture.from(`sheep-walk-2.png`)
    ]
  }
  return textures
}
