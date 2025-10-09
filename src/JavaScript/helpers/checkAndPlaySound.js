export const sound = new Audio('/assets/Orders.mp3')
let userInteracted = false
let isPlaying = false
const setIsPlaying = (value) => (isPlaying = value)
export const setUserInteracted = (value) => (userInteracted = value)
export const toggleBlinkingEffect = (element, shouldBlink) => {
  shouldBlink
    ? element.classList.add('blinking')
    : element.classList.remove('blinking')
}
const checkAndPlaySound = () => {
  const pending = document.querySelectorAll('button[data-status="Pendiente"]')
  if (pending.length > 0 && userInteracted) {
    if (!isPlaying) {
      sound.loop = true
      sound.play()
      setIsPlaying(true)
    }
    pending.forEach((order) => {
      const summary = order.closest('details').querySelector('summary')
      toggleBlinkingEffect(summary, true)
    })
  } else {
    if (isPlaying) {
      sound.pause()
      sound.currentTime = 0
      setIsPlaying(false)
    }
  }
}
let debounceTimer
export const triggerCheckAndPlaySound = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    checkAndPlaySound()
  }, 100)
}
document.addEventListener('click', () => setUserInteracted(true))
document.addEventListener('keydown', () => setUserInteracted(true))
