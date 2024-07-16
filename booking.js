const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointments@gmail.com'

let clientName = document.getElementById('name')
let personalEmail = document.querySelector('.email')
let date = document.getElementById('date')
let time = document.getElementById('time')
let description = document.getElementById('description')

let modal = document.getElementById('appointmentFormModal')
let attendees = []

function submitForm(event) {
  event.preventDefault()

  scheduledAppointment()

  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  let emails = document.querySelectorAll('.email')
  let phoneNumber = handlePhoneNumber()

  emails.forEach(emailInput => {
    attendees.push({ email: emailInput.value })
  })

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Create a Date object in local time
  let localDateTime = new Date(`${date.value}T${time.value}:00`)

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
    description: `What:\n60 Mins Meeting between <strong>Ron Clarin</strong> and <strong>${clientName.value}</strong>\n\nInvitee Time Zone:\n${timeZone}\n\nContact no.:\n+${phoneNumber}\n\nWho:\n\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${clientName.value}\n<a href="mailto:${personalEmail.value}">${personalEmail.value}</a>\n\nAdditional Notes:\n${description.value}`,
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

function scheduledAppointment() {
  const appTabBody = document.querySelector('.appTabBody')
  const appBody = document.querySelector('.appBody')

  const ceoDetails = document.querySelector('.ceoDetails')
  const appDetails = document.querySelector('.appDetails')
  const scheduledAppointment = document.querySelector('.scheduledAppointment')

  appTabBody.style.cssText = 'width: 30vw !important;'
  appBody.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
  `
  scheduledAppointment.setAttribute('style', 'display: flex !important;')
  ceoDetails.setAttribute('style', 'display: none !important;')
  appDetails.setAttribute('style', 'display: none !important;')

  // SCHEDULED APPOINTMENT UI
  const scheduledAppointmentContainer = document.querySelector(
    '.scheduledAppointment'
  )
  const detailsContainer = document.createElement('div')

  detailsContainer.innerHTML = `
    <div class="scheduledAppointmentBtns">
      <button id="reschedule" onclick="rescheduleAppointment()">Reschedule</button>
      <button id="cancel" onclick="cancelAppointment()">Cancel</button>
    </div>
  `
  scheduledAppointmentContainer.appendChild(detailsContainer)
}

function handlePhoneNumber() {
  let input = document.querySelector('#phone')

  // Get the selected country code using the intlTelInput API
  let countryCode = iti.getSelectedCountryData().dialCode

  return input.value && countryCode + input.value
}

// APPOINTMENT FORM MODAL
function appointmentFormModal() {
  modal.style.display = 'flex'
}

// CLOSE FORM
function closeAppointmentFormModal() {
  let phone = document.getElementById('phone')

  if (
    clientName.value ||
    personalEmail.value ||
    phone.value ||
    date.value ||
    time.value ||
    attendees.length > 0
  ) {
    const confirmModal = confirm(
      'Are you sure you want to exit the appointment form?'
    )
    if (!confirmModal) return
  }

  const appTabBody = document.querySelector('.appTabBody')
  const appBody = document.querySelector('.appBody')

  const ceoDetails = document.querySelector('.ceoDetails')
  const appDetails = document.querySelector('.appDetails')
  const scheduledAppointment = document.querySelector('.scheduledAppointment')

  appTabBody.style.cssText = 'width: 80vw !important;'
  appBody.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 2fr;
    background-color: white;
    height: 100%;
    padding: 25px;
  `
  scheduledAppointment.setAttribute('style', 'display: none !important;')
  ceoDetails.setAttribute('style', 'display: flex !important;')
  appDetails.setAttribute('style', 'display: flex !important;')

  clientName.value = ''
  personalEmail.value = ''
  phone.value = ''
  date.value = ''
  time.value = ''
  description.value = ''
  attendees = []

  modal.style.display = 'none'
}
