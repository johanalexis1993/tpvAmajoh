const addIngredient = (container) => {
  const ingredientInputs = document.querySelector(`#${container}`)
  const ingredientCount =
    ingredientInputs.querySelectorAll('input[type="text"]').length + 1
  const fragment = document.createDocumentFragment()
  const newIngredientDiv = document.createElement('div')
  newIngredientDiv.classList.add('divIngredient')
  let innerHTML = `
    <label for="name${ingredientCount}">
    <input type="text" id="name${ingredientCount}" name="ingredients[${
    ingredientCount - 1
  }][name]" required>
  <span>Ingrediente:</span>
    </label>
    <label for="amount${ingredientCount}">
    <input type="number" id="amount${ingredientCount}" name="ingredients[${
    ingredientCount - 1
  }][amount]" step="0.01" required>
  <span>Cantidad:</span>
  </label>
  `
  if (container === 'ingredientInputs') {
    innerHTML += `
      <label>
        <select id="imgAllergies${ingredientCount}" name="ingredients[${
      ingredientCount - 1
    }][imgAllergies]" multiple>
          <option value="" disabled selected></option>
          <option value="lupins">Altramuces</option>
          <option value="celery">Apio</option>
          <option value="sulphurDioxideAndSulphites">Azufre y sulfitos</option>
          <option value="peanuts">Cacahuetes</option>
          <option value="crustaceans">Crustáceos</option>
          <option value="treeNuts">Frutos de cáscara</option>
          <option value="gluten">Gluten</option>
          <option value="eggs">Huevos</option>
          <option value="dairy">Lácteos</option>
          <option value="molluscs">Moluscos</option>
          <option value="mustard">Mostaza</option>
          <option value="fish">Pescado</option>
          <option value="sesame">Sésamo</option>
          <option value="soja">Soja</option>
        </select>
        <span>Seleccione alergeno</span>
      </label>
    `
  }
  innerHTML += `<button type="button" class="removeIngredientBtn">Eliminar</button>`
  newIngredientDiv.innerHTML = innerHTML
  fragment.append(newIngredientDiv)
  ingredientInputs.append(fragment)
  newIngredientDiv
    .querySelector('.removeIngredientBtn')
    .addEventListener('click', () => newIngredientDiv.remove())
}
document
  .querySelector('#ingredientInputs button')
  .addEventListener('click', () => addIngredient('ingredientInputs'))
document
  .querySelector('#ingredientsProducts button')
  .addEventListener('click', () => addIngredient('ingredientsProducts'))
