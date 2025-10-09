document.querySelector('#clientes button').addEventListener('click', () => {
  let contactNameInput = document.querySelector('#nombreContacto')
  let contactEmailInput = document.querySelector('#emailContacto')
  let contactMessageInput = document.querySelector('#mensajeContacto')
  let contactName = contactNameInput.value
  let contactEmail = contactEmailInput.value
  let contactMessage = contactMessageInput.value
  if (!contactName || !contactEmail || !contactMessage)
    alert('Please fill in all fields.')
  alert(
    `Message sent:
     Name: ${contactName}
     Email: ${contactEmail}
     Message: ${contactMessage}`
  )
  contactNameInput.value = ''
  contactEmailInput.value = ''
  contactMessageInput.value = ''
})
