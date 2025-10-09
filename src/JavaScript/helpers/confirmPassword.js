import { showToast } from './showToast.js'
requestIdleCallback(() => {
  const check = (input, passwordInput) => {
    const passwordInputElement = document.querySelector(`#${passwordInput}`)
    if (!passwordInputElement) return
    const isMatch = input.value === passwordInputElement.value
    input.setCustomValidity(isMatch ? '' : 'Las contraseñas deben coincidir.')
    input.style.borderColor = isMatch ? 'green' : 'red'
    if (!isMatch) {
      if (!input.dataset.alertShown) {
        showToast('Las contraseñas no coinciden, rectifícalas.', 'error')
        input.dataset.alertShown = 'true'
      } else {
        input.dataset.alertShown = 'false'
      }
    }
  }
  const confirm = (confirmInputId, passwordInputId) => {
    const input = document.querySelector(`#${confirmInputId}`)
    if (!input) return
    input.addEventListener('blur', () => check(input, passwordInputId))
  }
  confirm('confirmPasswordReservation', 'password')
  confirm('confirmPassword', 'contraseña')
  confirm('confirmarPassword', 'password')
  document.querySelector('#creditCard').addEventListener('input', function () {
    if (this.value.length > 16) this.value = this.value.slice(0, 16)
  })
  document.querySelector('#cvv').addEventListener('input', function () {
    if (this.value.length > 3) this.value = this.value.slice(0, 3)
  })
  const forms = document.querySelectorAll('form')
  const text = 'input[required], textarea[required], select[required]'
  const disabledButton = 'button[type="submit"], button[disabled]'
  forms.forEach((form) => {
    const inputs = form.querySelectorAll(text)
    const checkAllFields = () => {
      const allFilled = Array.from(inputs).every(
        (field) => field.value.trim() !== ''
      )
      const button = form.querySelector(disabledButton)
      if (button) button.disabled = !allFilled
    }
    inputs.forEach((input) => {
      const toggleValidClass = () => {
        input.classList.toggle('input-valid', input.value.trim() !== '')
        checkAllFields()
      }
      input.addEventListener('input', toggleValidClass)
      input.addEventListener('change', toggleValidClass)
      input.addEventListener('blur', toggleValidClass)
    })
  })
})
requestIdleCallback(() => {
  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte']
  document.querySelectorAll('input[type="password"]').forEach((input) => {
    let meter = null
    let text = null
    input.addEventListener('focus', () => {
      if (!meter) {
        meter = document.createElement('meter')
        meter.className = 'password-strength-element'
        meter.min = 0
        meter.max = 4
        meter.low = 1
        meter.high = 3
        meter.optimum = 4
        meter.value = 0
        input.parentElement.append(meter)
      }
      if (!text) {
        text = document.createElement('small')
        text.className = 'password-strength-element'
        input.parentElement.append(text)
      }
      meter.classList.add('password-strength-visible')
      text.classList.add('password-strength-visible')
    })
    input.addEventListener('blur', () => {
      if (meter && text) {
        meter.classList.remove('password-strength-visible')
        text.classList.remove('password-strength-visible')
      }
    })
    input.addEventListener('input', () => {
      if (!meter || !text) return
      const val = input.value
      let strength = 0
      if (val.length > 5) strength++
      if (/[A-Z]/.test(val)) strength++
      if (/[0-9]/.test(val)) strength++
      if (/[^A-Za-z0-9]/.test(val)) strength++
      meter.value = strength
      text.textContent = labels[strength]
    })
  })
})
