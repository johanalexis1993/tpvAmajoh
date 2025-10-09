document.querySelector('#menu-toggle').addEventListener('click', () => {
  const sidebar = document.querySelector('aside')
  sidebar
    ? requestAnimationFrame(() => sidebar.classList.toggle('hidden'))
    : console.error("No se pudo encontrar el elemento 'aside'.")
})
