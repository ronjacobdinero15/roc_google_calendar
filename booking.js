const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointments@gmail.com'

function submitForm(event) {
  event.preventDefault()

  bookedModal()

  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  let name = document.getElementById('name').value
  let personalEmail = document.querySelector('.email').value
  let emails = document.querySelectorAll('.email')
  let phoneNumber = handlePhoneNumber()
  let date = document.getElementById('date').value
  let time = document.getElementById('time').value
  let attendees = []

  // if (emails.length > 0) {
  //   emails.forEach(input => {
  //     console.log(input.value)
  //   })
  // } else {
  //   console.log(personal)
  // }

  emails.forEach(emailInput => {
    attendees.push({ email: emailInput.value })
  })

  let description = document.getElementById('description').value
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Create a Date object in local time
  let localDateTime = new Date(`${date}T${time}:00`)

  // Convert local time to UTC
  let utcDateTime = localDateTime.toISOString()

  // Calculate the end time (60 minutes later) in UTC
  let utcEndDateTime = new Date(
    localDateTime.getTime() + CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME * 60000
  ).toISOString()

  let formData = {
    summary: 'Client Meeting',

    // TODO: Must create a meeting link
    // TODO: Must email the client about this link
    description: `What:\n60 Mins Meeting between <strong>Ron Clarin</strong> and <strong>${name}</strong>\n\nInvitee Time Zone:\n${timeZone}\n\nContact no.:\n+${phoneNumber}\n\nWho:\n\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${name}\n<a href="mailto:${personalEmail}">${personalEmail}</a>\n\nAdditional Notes:\n${description}`,
    start: {
      dateTime: utcDateTime,
      timeZone: 'UTC', // Use UTC time zone for Google Calendar API
    },
    end: {
      dateTime: utcEndDateTime,
      timeZone: 'UTC', // Use UTC time zone for Google Calendar API
    },
    attendees,
  }

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(formData),
  }

  fetch(
    'https://v1.nocodeapi.com/rocappointments/calendar/eVzcIvSFHQgCDEuz/event',
    requestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
}

function handlePhoneNumber() {
  let input = document.querySelector('#phone')

  // Get the selected country code using the intlTelInput API
  let countryCode = iti.getSelectedCountryData().dialCode

  return input.value && countryCode + input.value
}

function bookedModal() {
  let modal = document.getElementById('bookedModal')
  modal.style.display = 'block'

  let span = document.getElementsByClassName('close')[0]
  span.onclick = function () {
    modal.style.display = 'none'
  }
}

// APPOINTMENT FORM MODAL
function appointmentFormModal() {
  let modal = document.getElementById('appointmentFormModal')
  modal.style.display = 'flex'
}

// CLOSE FORM
async function closeAppointmentFormModal() {
  let phoneNumber = await handlePhoneNumber()

  let name = document.getElementById('name')
  let email = document.querySelector('.email')
  let phone = document.getElementById('phone')
  let date = document.getElementById('date')
  let time = document.getElementById('time')
  let description = document.getElementById('description')

  let modal = document.getElementById('appointmentFormModal')

  if (name.value || email.value || phone.value || date.value || time.value) {
    const confirmModal = confirm(
      'Are you sure you want to exit the appointment form?'
    )
    if (!confirmModal) return
  }

  name.value = ''
  email.value = ''
  phone.value = ''
  date.value = ''
  time.value = ''
  description.value = ''

  modal.style.display = 'none'
}
