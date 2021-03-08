import * as PIXI from 'pixi.js'
import { Windmill } from './windmill'
import { Meadow } from './meadow'
import { Mountains } from './mountains'
import { Sky } from './sky'
import { Fence } from './fence'
import { Clouds } from './clouds'
import { Sun } from './sun'

export class Background {
  private sky: Sky
  private clouds: Clouds
  private sun: Sun
  private windmill: Windmill
  private fence: Fence
  private meadow: Meadow
  private mountains: Mountains
  private container: PIXI.Container

  constructor (width: number, skyHeight: number, meadowHeight: number) {
    this.container = new PIXI.Container()
    this.sky = new Sky()
    this.sky.spawn(this.container)
    this.sun = new Sun()
    this.sun.spawn(this.container)
    this.mountains = new Mountains()
    this.mountains.spawn(this.container)
    this.clouds = new Clouds()
    this.clouds.spawn(this.container)
    this.windmill = new Windmill()
    this.windmill.spawn(this.container)
    this.meadow = new Meadow()
    this.meadow.spawn(this.container)
    this.fence = new Fence()
    this.fence.spawn(this.container)
    this.setSize(width, skyHeight, meadowHeight)
  }

  setSize (width: number, skyHeight: number, meadowHeight: number) {
    const { clouds, fence, meadow, mountains, sky, windmill } = this
    sky.setSize(width, skyHeight)
    sky.setPosition(0, 0)

    mountains.setSize(width, skyHeight * 0.45)
    mountains.setPosition(0, skyHeight - mountains.height)

    this.sun.setSize(skyHeight * 0.5, skyHeight * 0.5)
    this.sun.setPosition(width * 0.05, skyHeight * 0.01)

    clouds.setSize(width, skyHeight)

    meadow.setSize(width, meadowHeight)
    meadow.setPosition(0, skyHeight)

    const windmillHeight = skyHeight * 0.8
    const windmillWidth = (windmill.width / windmill.height) * windmillHeight
    windmill.setPosition(width * 0.6, skyHeight - windmillHeight)
    windmill.setSize(windmillWidth, windmillHeight)

    fence.setSize(width, skyHeight * 0.15)
    fence.setPosition(0, skyHeight - fence.height)
  }

  spawn (container: PIXI.Container) {
    container.addChild(this.container)
  }

  update (delta: number) {
    this.windmill.rotate(delta)
    this.clouds.wander(delta)
  }
}
