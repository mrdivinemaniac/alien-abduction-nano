import * as PIXI from 'pixi.js'
import { randIntBetween } from '../../utils'
import { Lane } from './objects/lane'

class Engine {
  private app: PIXI.Application;
  private assetsLoaded: boolean = false
  private lanes: Lane[] = []

  constructor () {
    this.app = new PIXI.Application({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1
    })
  }

  loadAssets () {
    return new Promise<void>((resolve, reject) => {
      console.info('Loading Assets')
      this.app.loader
        .add('spritesheet', 'spritesheets/sheep-walk/sheep-walk.json')
        .load(() => {
          console.info('Assets Loaded')
          this.assetsLoaded = true
          resolve()
        })
    })
  }

  private checkAssetsLoaded () {
    if (!this.assetsLoaded) {
      throw new Error('Cannot start engine without loading assets')
    }
  }

  private initialize () {
    const laneHeight = 60
    const laneGap = laneHeight * 0.3
    const laneAreaHeight = this.app.screen.height * 0.4
    const numLanes = laneAreaHeight / laneGap
    const laneDrawStart = this.app.screen.height * 0.3 // Start the lanes at 30% of screen
    for (let i = 0; i < numLanes; ++i) {
      const lane = new Lane()
      lane.spawn(this.app.stage, 0, laneDrawStart + i * laneGap, this.app.screen.width, laneHeight)
      this.lanes.push(lane)
    }

    document.body.appendChild(this.app.view)
  }

  start () {
    this.checkAssetsLoaded()
    this.initialize()
    this.app.ticker.add(delta => {
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
