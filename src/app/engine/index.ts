import * as PIXI from 'pixi.js'
import { randIntBetween } from '../../utils'
import { preloadAssets } from './assets'
import { Background } from './objects/background'
import { Lane } from './objects/lane'

class Engine {
  private app: PIXI.Application;
  private assetsLoaded: boolean = false
  private lanes: Lane[] = []
  private background: Background

  constructor () {
    this.app = new PIXI.Application({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      backgroundColor: 0x00bfff,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1 
    })
  }

  async loadAssets () {
    await preloadAssets(this.app.loader)
    this.assetsLoaded = true
  }

  private checkAssetsLoaded () {
    if (!this.assetsLoaded) {
      throw new Error('Cannot start engine without loading assets')
    }
  }

  private initBackground (width: number, skyHeight: number, meadowHeight: number) {
    const background = new Background(width, skyHeight, meadowHeight)
    background.spawn(this.app.stage)
    this.background = background
  }

  private initLanes (width: number, meadowHeight: number, laneStartY: number) {
    // TODO: smarter lane heights for vertical screens
    // Aim for X number of sheeps on the screen
    // Adjust width and height accordingly
    const laneHeight = meadowHeight / 3
    const laneGap = laneHeight * 0.2
    const numLanes = (meadowHeight - laneHeight) / laneGap

    for (let i = 0; i < numLanes; ++i) {
      const lane = new Lane()
      lane.setSize(width, laneHeight)
      lane.setPosition(0, laneStartY + i * laneGap)
      lane.spawn(this.app.stage)
      this.lanes.push(lane)
    }
  }

  private initialize () {
    const width = this.app.screen.width
    const meadowHeight = this.app.screen.height * 0.35
    const skyHeight = this.app.screen.height - meadowHeight
    this.initBackground(width, skyHeight, meadowHeight)
    this.initLanes(width, meadowHeight, skyHeight * 0.95)
  }

  start () {
    this.checkAssetsLoaded()
    this.initialize()
    document.body.appendChild(this.app.view)

    this.app.ticker.add(delta => {
      this.background.update(delta)
      this.lanes.forEach(lane => lane.herdTheSheep(delta))
    })
  }

  spawnTheSheep (speed?: number) {
    const chosenLane = this.lanes[randIntBetween(0, this.lanes.length)]
    chosenLane.spawnASheep(speed)
  }
}

let engine: Engine

export function initializeEngine () {
  if (engine) throw new Error('Engine already started!')
  engine = new Engine()
  return engine
}
