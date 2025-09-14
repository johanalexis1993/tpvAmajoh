import { autocomplete } from '../logic/get/autocomplete.js'
import { getEmail } from '../api/gets.js'
export function handleInputEvent(selector, endpoint, mapCallback) {
  const addInputEvent = (element) => {
    element.addEventListener('input', async function () {
      const searchText = this.value.trim()
      if (searchText !== '') {
        const results = await getEmail(endpoint, searchText)
        autocomplete(this, results.map(mapCallback))
      }
    })
  }
  const initialElement = document.querySelector(selector)
  if (initialElement) addInputEvent(initialElement)
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            const element = node.matches(selector)
              ? node
              : node.querySelector(selector)
            if (element) addInputEvent(element)
          }
        }
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
export const delegarClicks = (configs = []) => {
  configs.forEach(([selector, handler]) => {
    const el = document.querySelector(selector)
    el
      ? el.addEventListener('click', handler)
      : console.warn(`⚠️ Elemento no encontrado: ${selector}`)
  })
}
