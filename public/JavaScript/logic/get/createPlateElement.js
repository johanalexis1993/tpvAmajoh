import { createOrderLocal } from '../post/createOrderLocal.js'
import { eliminarElemento } from '../../api/delete.js'
import { removePlateFromDOM } from '../delete/updateUIAfterDelete.js'
const allergenImages = {
  lupins:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115674/altramuces_rsje17.webp',
  celery:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115674/apio_oerihw.webp',
  sulphurDioxideAndSulphites:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115674/azufreYsulfitos_yarnv3.webp',
  peanuts:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115674/cacahuetes_adclca.webp',
  crustaceans:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115675/crustaceos_hhe0a3.webp',
  treeNuts:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115675/frutosDeCascara_dn7dvs.webp',
  gluten:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115675/gluten_zjirt6.webp',
  eggs: 'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115675/huevos_oitpyp.webp',
  dairy:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115401/lacteos_qxvjzb.webp',
  molluscs:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115675/moluscos_x4o689.webp',
  mustard:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115689/mostaza_kv9zcp.webp',
  fish: 'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115689/pescado_poqsbd.webp',
  sesame:
    'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115689/sesamo_ssfejb.webp',
  soy: 'https://res.cloudinary.com/dx0fsy5fw/image/upload/f_webp,q_auto:eco/v1753115689/soja_e2ewfu.webp'
}
const createTooltip = (ingredients) => {
  const ingredientList = document.createElement('ul')
  ingredientList.classList.add('tooltip')
  ingredients.forEach((ing) => {
    const ingredientItem = document.createElement('li')
    ingredientItem.textContent = ing.name
    if (ing.imgAllergies && ing.imgAllergies.length > 0) {
      const allergenImagesContainer = document.createElement('figure')
      allergenImagesContainer.classList.add('allergen-images')
      allergenImagesContainer.style.padding = '0'
      ing.imgAllergies.forEach((allergen) => {
        if (allergenImages[allergen]) {
          const allergenImg = document.createElement('img')
          allergenImg.src = allergenImages[allergen]
          allergenImg.alt = allergen
          allergenImg.title = allergen
          allergenImg.style.width = 'var(--1-5rem)'
          allergenImg.style.height = 'var(--1-5rem)'
          allergenImagesContainer.append(allergenImg)
        }
      })
      ingredientItem.append(allergenImagesContainer)
    }
    ingredientList.append(ingredientItem)
  })
  return ingredientList
}
export const createPlateElement = (plato) => {
  const liPlato = document.createElement('li')
  const figure = document.createElement('figure')
  const picture = document.createElement('picture')
  const img = document.createElement('img')
  const figcaption = document.createElement('figcaption')
  const precioParrafo = document.createElement('p')
  const h3 = document.createElement('h3')
  const eliminarBtn = document.createElement('button')
  liPlato.dataset.id = plato._id
  img.src = plato.imgUrl
  img.alt = plato.title
  img.title = plato.title
  img.loading = 'eager'
  const tooltip = createTooltip(plato.ingredients)
  liPlato.append(tooltip)
  liPlato.classList.add('has-tooltip')
  precioParrafo.textContent = `Precio: ${plato.price.toFixed(2)}€`
  h3.textContent = plato.title
  eliminarBtn.textContent = 'Eliminar'
  eliminarBtn.classList.add('eliminar-btn')
  eliminarBtn.addEventListener('click', async () => {
    const deleted = await eliminarElemento(plato._id, 'plate/')
    removePlateFromDOM(plato._id, plato.category, deleted)
  })
  picture.append(img)
  figure.append(picture, figcaption)
  figcaption.append(precioParrafo, h3, eliminarBtn)
  liPlato.append(figure)
  if (plato.stock === 'available') {
    const agregarBtn = document.createElement('button')
    agregarBtn.textContent = 'Agregar'
    agregarBtn.classList.add('agregar-btn')
    agregarBtn.addEventListener('click', () => createOrderLocal(plato))
    figcaption.append(agregarBtn)
  }
  return liPlato
}
