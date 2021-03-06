export function randIntBetween (min: number, max: number) {
  return Math.floor(randBetween(min, max))
}

export function randBetween (min: number, max: number) {
  return min + (Math.random() * (max - min))
}

