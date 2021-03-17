import sound from 'pixi-sound'

let muted = false

export const soundControl = {
  toggleMute: () => muted = !muted,
  get isMuted () {
    return muted
  },
  play: (sound: sound.Sound) => {
    if (!muted && sound.isLoaded) sound.play()
  }
}
