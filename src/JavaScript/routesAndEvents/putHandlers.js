import { toggleStockStatus } from '../api/put.js'
import { togglePlateButtons } from '../helpers/togglePlateButtons.js'
import { functionCheckbox } from '../helpers/bindCheckboxGroup.js'
let selectProducts = false
const handleClick = (section, itemSelector) => {
  document.querySelector(section).addEventListener('click', () => {
    selectProducts
      ? (toggleStockStatus(),
        togglePlateButtons(false),
        (selectProducts = false))
      : (functionCheckbox(section, itemSelector), (selectProducts = true))
  })
}
handleClick('#sectionUnavailablePlates', '#unavailables .has-tooltip')
handleClick('#sectionAvailablePlates', '#platos-lista .has-tooltip')
