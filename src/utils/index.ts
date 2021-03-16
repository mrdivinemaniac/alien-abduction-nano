export function randIntBetween (min: number, max: number) {
  return Math.floor(randBetween(min, max))
}

export function randBetween (min: number, max: number) {
  return min + (Math.random() * (max - min))
}

export function clamp (value: number, min: number, max: number) {
  if (value < min) return min
  else if (value > max) return max
  return value
}

export function openLink (link: string) {
  window.open(link, '_blank')
}
