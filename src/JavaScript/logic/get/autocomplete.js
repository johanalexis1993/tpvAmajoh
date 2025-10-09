export const autocomplete = (input, suggestions) => {
  let currentFocus = -1
  const closeAllLists = (elmnt) =>
    document
      .querySelectorAll('.autocomplete-items')
      .forEach((item) => elmnt !== item && elmnt !== input && item.remove())
  input.addEventListener('input', () => {
    const val = input.value
    closeAllLists()
    if (!val) return false
    const container = document.createElement('div')
    container.setAttribute('id', `${input.id}-autocomplete-list`)
    container.setAttribute('class', 'autocomplete-items')
    input.parentNode.append(container)
    suggestions
      .filter(
        (suggestion) =>
          suggestion.slice(0, val.length).toUpperCase() === val.toUpperCase()
      )
      .forEach((suggestion) => {
        const item = document.createElement('div')
        item.innerHTML = `<strong>${suggestion.slice(
          0,
          val.length
        )}</strong>${suggestion.slice(
          val.length
        )}<input type='hidden' value='${suggestion}'>`
        item.addEventListener('click', () => {
          input.value = suggestion
          closeAllLists()
        })
        container.append(item)
      })
  })
  input.addEventListener('keydown', (e) => {
    let items = document.getElementById(`${input.id}-autocomplete-list`)
    if (items) items = items.getElementsByTagName('div')
    if (e.keyCode === 40 || e.keyCode === 38) {
      currentFocus += e.keyCode === 40 ? 1 : -1
      Array.from(items).forEach((item, index) =>
        index === currentFocus
          ? (item.classList.add('autocomplete-active'),
            (input.value = item.getElementsByTagName('input')[0].value))
          : item.classList.remove('autocomplete-active')
      )
    } else if (e.keyCode === 13 && items && currentFocus > -1) {
      e.preventDefault()
      items[currentFocus].click()
    }
  })
  document.addEventListener('click', (e) => closeAllLists(e.target))
}
