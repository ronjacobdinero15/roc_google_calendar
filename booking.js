const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointments@gmail.com'

// Initialize eventId from localStorage if available
let eventId = localStorage.getItem('eventId') || ''

let clientName = document.getElementById('name')
let personalEmail = document.querySelector('.email')
let date = document.getElementById('date')
let time = document.getElementById('time')
let description = document.getElementById('description')
let appointmentFormModalDisplay = document.getElementById(
  'appointmentFormModal'
)
let rescheduleActive = false
let attendees = []
let client = {}
let myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')

function submitForm(event) {
  event.preventDefault()

  scheduledAppointment()

  let emails = document.querySelectorAll('.email')
  attendees = []
  emails.forEach(emailInput => {
    attendees.push({ email: emailInput.value })
  })

  // Update client object
  client = {
    name: clientName.value,
    personalEmail: personalEmail.value,
    guestEmails: attendees.slice(1),
    phoneNumber: handlePhoneNumber(),
    date: date.value,
    time: time.value,
    description: description.value,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  console.log(client)

  // Create a Date object in local time
  let localDateTime = new Date(`${date.value}T${time.value}:00`)

  // Convert local time to UTC
  let utcDateTime = localDateTime.toISOString()

  // Calculate the end time (60 minutes later) in UTC
  let utcEndDateTime = new Date(
    localDateTime.getTime() + CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME * 60000
  ).toISOString()

  if (!eventId) {
    // SEND A NEW FORM DATA
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: JSON.stringify({
        summary: 'Client Meeting',
        // location: 'Event location details',
        description: `What:\n60 Mins Meeting between <strong>Ron Clarin</strong> and <strong>${client.name}</strong>\n\nInvitee Time Zone:\n${client.timeZone}\n\nContact no.:\n+${client.phoneNumber}\n\nWho:\n\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${client.name}\n<a href="mailto:${client.personalEmail}">${client.personalEmail}</a>\n\nAdditional Notes:\n${client.description}`,
        start: {
          dateTime: utcDateTime,
          timeZone: 'UTC', // Use UTC time zone for Google Calendar API
        },
        end: {
          dateTime: utcEndDateTime,
          timeZone: 'UTC', // Use UTC time zone for Google Calendar API
        },
        sendNotifications: true,
        attendees,
      }),
    }

    fetch(
      'https://v1.nocodeapi.com/rocappointments/calendar/eVzcIvSFHQgCDEuz/event?sendNotifications=true&sendUpdates=all',
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        eventId = result.id // Update eventId from the API response
        localStorage.setItem('eventId', eventId) // Store eventId persistently
        console.log(eventId)
      })
      .catch(error => console.log('error', error))
  } else {
    // RESCHEDULE
    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
      body: JSON.stringify({
        summary: 'Client Meeting',
        description: `What:\n60 Mins Meeting between <strong>Ron Clarin</strong> and <strong>${client.name}</strong>\n\nInvitee Time Zone:\n${client.timeZone}\n\nContact no.:\n+${client.phoneNumber}\n\nWho:\n\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${client.name}\n<a href="mailto:${client.personalEmail}">${client.personalEmail}</a>\n\nAdditional Notes:\n${client.description}`,
        start: { dateTime: utcDateTime, timeZone: 'UTC' },
        end: { dateTime: utcEndDateTime, timeZone: 'UTC' },
        sendNotifications: true,
        attendees,
      }),
    }

    fetch(
      `https://v1.nocodeapi.com/rocappointments/calendar/eVzcIvSFHQgCDEuz/event?eventId=${eventId}&sendNotifications=true&sendUpdates=all`,
      requestOptions
    )
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
  }
}

function handlePhoneNumber() {
  let input = document.querySelector('#phone')

  // Get the selected country code using the intlTelInput API
  let countryCode = iti.getSelectedCountryData().dialCode

  return input.value && countryCode + input.value
}

// APPOINTMENT FORM MODAL
function appointmentFormModal() {
  appointmentFormModalDisplay.style.display = 'flex'
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

  returnAppointmentForm()

  clientName.value = ''
  personalEmail.value = ''
  phone.value = ''
  date.value = ''
  time.value = ''
  description.value = ''
  attendees = []
  client = {}
  localStorage.removeItem('eventId')

  appointmentFormModalDisplay.style.display = 'none'
}

function returnAppointmentForm() {
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
  ceoDetails.setAttribute('style', 'display: flex')
  appDetails.setAttribute('style', 'display: flex')
}

function rescheduleAppointment() {
  returnAppointmentForm()
}

function cancelAppointment() {
  let requestOptions = {
    method: 'delete',
    headers: myHeaders,
    redirect: 'follow',
  }

  fetch(
    `https://v1.nocodeapi.com/rocappointments/calendar/eVzcIvSFHQgCDEuz/event?eventId=${eventId}&sendNotifications=true&sendUpdates=all`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))

  const appointmentStatus = document.querySelector('.appointmentStatus')
  appointmentStatus.innerHTML = 'Meeting is now cancelled✅'

  const scheduledAppointmentBtns = document.querySelector(
    '.scheduledAppointmentBtns'
  )
  scheduledAppointmentBtns.innerHTML = ''
}

function scheduledAppointment() {
  // DISPLAY NONE CURRENT SCREEN
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

  // DISPLAY SCHEDULED APPOINTMENT UI
  if (!rescheduleActive) {
    const scheduledAppointmentContainer = document.querySelector(
      '.scheduledAppointment'
    )
    const detailsContainer = document.createElement('div')

    detailsContainer.innerHTML = `
    <div class="scheduledAppointmentBtns">
      <button id="reschedule">Reschedule</button>
      <button id="cancel">Cancel</button>
    </div>
  `
    // Event delegation example
    scheduledAppointmentContainer.addEventListener('click', function (event) {
      if (event.target.id === 'reschedule') {
        rescheduleAppointment()
      } else if (event.target.id === 'cancel') {
        cancelAppointment()
      }
    })

    scheduledAppointmentContainer.appendChild(detailsContainer)

    rescheduleActive = true
  }
}
