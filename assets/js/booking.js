const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointments.123@gmail.com'

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
let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
let timeZoneInput = document.querySelector('#timeZone')
timeZoneInput.value = timeZone
let myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')

function submitForm(event) {
  event.preventDefault()

  if (date.value === '' || time.value === '') return
  const dateValue = date.value
  const timeValue = time.value

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
    date: dateValue,
    time: timeValue,
    description: description.value,
    timeZone,
  }

  // Create a Date object in local time
  let localDateTime = new Date(`${date.value}T${time.value}:00`)

  // Calculate the end time (60 minutes later) in UTC
  let endDateTime = new Date(
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
        description: `<strong>What</strong>\n60 Mins Meeting between Ron Clarin and ${client.name}\n\n<strong>Invitee Time Zone</strong>\n${client.timeZone}\n\n<strong>Contact no.</strong>\n+${client.phoneNumber}\n\n<strong>Who</strong>\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${client.name}\n<a href="mailto:${client.personalEmail}">${client.personalEmail}</a>\n\n<strong>Additional Notes</strong>\n${client.description}`,
        start: {
          dateTime: localDateTime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone,
        },
        sendNotifications: true,
        attendees: [{ email: CEO_APPOINTMENT_EMAIL }, ...attendees],
      }),
    }
    fetch(
      `https://v1.nocodeapi.com/rocappointments12345/calendar/VzXJdjEnMMeVmhBv/event?calendarId=46237b98feac9bd44c94b5b47fb34b08ec4bcca24adb45f74d62171b235fccd4@group.calendar.google.com&sendNotifications=true&sendUpdates=all`,
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        eventId = result.id // Update eventId from the API response
        localStorage.setItem('eventId', eventId) // Store eventId persistently
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
        description: `<strong>What</strong>\n60 Mins Meeting between Ron Clarin and ${client.name}\n\n<strong>Invitee Time Zone</strong>\n${client.timeZone}\n\n<strong>Contact no.</strong>\n+${client.phoneNumber}\n\n<strong>Who</strong>\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${client.name}\n<a href="mailto:${client.personalEmail}">${client.personalEmail}</a>\n\n<strong>Additional Notes</strong>\n${client.description}`,
        start: {
          dateTime: localDateTime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone,
        },
        sendNotifications: true,
        attendees: [{ email: CEO_APPOINTMENT_EMAIL }, ...attendees],
      }),
    }

    fetch(
      `https://v1.nocodeapi.com/rocappointments12345/calendar/VzXJdjEnMMeVmhBv/event?eventId=${eventId}&calendarId=46237b98feac9bd44c94b5b47fb34b08ec4bcca24adb45f74d62171b235fccd4@group.calendar.google.com&sendNotifications=true&sendUpdates=all`,
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
  const guestEmailContainers = document.querySelectorAll('.guestEmailContainer')
  guestEmailContainers.forEach(container => container.remove())
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

function cancelAppointment() {
  let requestOptions = {
    method: 'delete',
    headers: myHeaders,
    redirect: 'follow',
  }

  fetch(
    `https://v1.nocodeapi.com/rocappointments12345/calendar/VzXJdjEnMMeVmhBv/event?eventId=${eventId}&calendarId=46237b98feac9bd44c94b5b47fb34b08ec4bcca24adb45f74d62171b235fccd4@group.calendar.google.com&sendNotifications=true&sendUpdates=all`,
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

  appTabBody.style.cssText = `
    width: 30vw !important;
    min-width: 300px;
  `
  appBody.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px;
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
    scheduledAppointmentContainer.addEventListener('click', function (event) {
      if (event.target.id === 'reschedule') {
        returnAppointmentForm()
      } else if (event.target.id === 'cancel') {
        cancelAppointment()
      }
    })

    scheduledAppointmentContainer.appendChild(detailsContainer)

    rescheduleActive = true
  }
}

// Clear localStorage on window refresh
window.onbeforeunload = function () {
  localStorage.removeItem('eventId')
}
