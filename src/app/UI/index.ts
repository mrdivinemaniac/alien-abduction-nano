export function hideLoadingBannner () {
  const banner = document.querySelector('#loading-banner') as HTMLDivElement
  banner.style.opacity = '0'
  banner.style.pointerEvents = 'none'
  setTimeout(() => {
    banner.parentElement.removeChild(banner)
  }, 1000)
}

export function showInfo () {
  const info = document.querySelector('#info') as HTMLDivElement
  info.style.opacity = '1'
}
