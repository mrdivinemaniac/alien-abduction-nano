import { randBetween } from '../utils'
import { nanoPrettify } from 'nano-prettify'
import { NanoDataSource, ConfirmationDataT } from './data-sources/nano'
import { initializeEngine } from './engine'
import * as UI from './UI'

const engine = initializeEngine()
engine.loadAssets().then(() => {
  UI.hideLoadingBannner()
  UI.showInfo()
  engine.start()
  const nanoDataSource = new NanoDataSource()
  nanoDataSource.onConfirmation(data => {
    const { amount, unit } = convertToSuitableUnit(data.amount)
    engine.spawnTheSheep(
      generateDescription(data.type, `${amount} ${unit}`),
      'http://sheep.com',
      determineSpeed(amount, unit),
      determineSize(amount, unit)
    )
  })
})

function generateDescription (type: ConfirmationDataT['type'], amount: string) {
  const action = type === 'send' ? 'sent' : 'received'
  return `Someone ${action}\n${amount}`
}

function convertToSuitableUnit (amount: string) {
  const prettified = nanoPrettify(amount, { commas: false })
  if (Number(prettified) === 0) {
    return { amount: amount, unit: 'raw' }
  } else {
    return { amount: prettified, unit: 'NANO' }
  }
}

function determineSpeed (amount: string, unit: string) {
  if (unit === 'raw') return randBetween(3.5, 4)
  else if (Number(amount) >= 1) return randBetween(2, 3)
  else return randBetween(3, 3.5)
}

function determineSize (amount: string, unit: string) {
  if (unit === 'raw') return randBetween(0.7, 0.79)
  else if (Number(amount) >= 1) return 1
  else return randBetween(0.8, 1)
}
