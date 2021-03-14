import { randBetween } from '../utils'
import { initializeEngine } from './engine'

const engine = initializeEngine()
engine.loadAssets().then(() => {
  engine.start()
  setInterval(() => {
    const scale = randBetween(0.7, 1)
    engine.spawnTheSheep('This is a sheep', 'http://sheep.com', randBetween(1, 4), scale)
  }, 100)
})
