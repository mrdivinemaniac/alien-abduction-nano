import * as PIXI from 'pixi.js'

export function preloadAssets (loader: PIXI.Loader) {
  return new Promise<void>((resolve, reject) => {
    console.info('Loading Assets')
    loader
      .add('sheep-spritesheet', 'spritesheets/sheep-walk/sheep-walk.json')
      .add('grass-texture-3', 'textures/grass.png')
      .add('windmill', 'spritesheets/windmill/windmill.json')
      .add('background', 'spritesheets/background/background.json')
      .add('cloud', 'textures/cloud.png')
      .add('sun', 'textures/sun.png')
      .load(() => {
        console.info('Assets Loaded')
        resolve()
      })
  })
}
