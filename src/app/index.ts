import { randBetween } from '../utils'
import { initializeEngine } from './engine'

const engine = initializeEngine()
engine.loadAssets().then(() => {
  engine.start()
  engine.spawnTheSheep(randBetween(1, 4))
  setInterval(() => {
    engine.spawnTheSheep(randBetween(1, 4))
  }, 100)
})
