const updates = []
const flushUpdates = () => {
  while (updates.length) {
    const fn = updates.shift()
    fn()
  }
}
const queueUpdate = (fn) => {
  updates.push(fn)
  if (updates.length === 1) requestAnimationFrame(flushUpdates)
}
const sections = {}
document.querySelectorAll('section').forEach((section) => {
  sections[section.id] = section
})
export const showSection = (sectionId) => {
  const selectedSection = sections[sectionId]
  if (!selectedSection) return console.error('La sección solicitada no existe.')
  for (const id in sections) {
    const section = sections[id]
    queueUpdate(
      () =>
        (section.style.display = section === selectedSection ? 'block' : 'none')
    )
  }
}
