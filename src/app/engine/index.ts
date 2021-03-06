import * as PIXI from 'pixi.js'

class Engine {
  private app: PIXI.Application;

  constructor () {
    this.app = new PIXI.Application({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1
    })
    
    document.body.appendChild(this.app.view)
  }

  start () {
    this.app.ticker.add(delta => {

    })
  }

  spawnTheSheep () {

  }
}

let engine: Engine

export function startEngine () {
  if (engine) throw new Error('Engine already started!')
  engine = new Engine()
  engine.start()
  return engine
}
