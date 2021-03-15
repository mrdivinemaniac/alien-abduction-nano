const aboutButton = document.querySelector('#about-button') as HTMLSpanElement
const banner = document.querySelector('#loading-banner') as HTMLDivElement
const info = document.querySelector('#info') as HTMLDivElement
const aboutFull = document.querySelector('#about-full') as HTMLDivElement

aboutButton.addEventListener('click', toggleAbout)

function toggleAbout (e: Event) {
  if (aboutFull.classList.contains('visible')) {
    hide(aboutFull)
    aboutButton.classList.remove('expanded')
    aboutButton.innerText = '🤔 About'
  } else {
    show(aboutFull)
    aboutButton.innerText = '❎ About'
    aboutButton.classList.add('expanded')
  }
}

export function hideLoadingBannner () {
  hide(banner)
}

export function showInfo () {
  show(info)
}

function hide (elem: HTMLElement) {
  elem.classList.add('hidden')
  elem.classList.remove('visible')
}

function show (elem: HTMLElement) {
  elem.classList.remove('hidden')
  elem.classList.add('visible')
}
