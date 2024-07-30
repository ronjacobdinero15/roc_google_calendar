const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointmentscheduling@gmail.com'
const GOOGLE_MEET_LINK = 'https://meet.google.com/zfh-imfr-kdc'

// Initialize eventId from localStorage if available
let eventId = localStorage.getItem('eventId') || ''

let clientName = document.getElementById('name')
let personalEmail = document.querySelector('.email')
let date = document.getElementById('date')
let time = document.getElementById('time')
let description = document.getElementById('description')

let methodMeetingInfo = document.getElementById('methodMeetingInfo')
let locationMeetingInfo = document.getElementById('locationMeetingInfo')
let whatMeetingInfo = document.getElementById('whatMeetingInfo')
let timeZoneMeetingInfo = document.getElementById('timeZoneMeetingInfo')
let contactMeetingInfo = document.getElementById('contactMeetingInfo')
let whoMeetingInfo = document.getElementById('whoMeetingInfo')
let additionalMeetingInfo = document.getElementById('additionalMeetingInfo')
let method = document.getElementById('method')

let appointmentFormModalDisplay = document.getElementById(
  'appointmentFormModal'
)
let rescheduleActive = false
let attendees = []
let client = {
  name: '',
  personalEmail: '',
  guestEmails: '',
  phoneNumber: null,
  date: '',
  time: '',
  description: '',
  timeZone: '',
  method: '',
  preferredBranch: '',
}
let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
let timeZoneInput = document.querySelector('#timeZone')
timeZoneInput.value = timeZone
let myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')

function submitForm(e) {
  e.preventDefault()

  if (date.value === '' || time.value === '') return

  scheduledAppointment()

  let emails = document.querySelectorAll('.email')
  emails.forEach(emailInput => {
    attendees.push({ email: emailInput.value })
  })

  // Update client object
  client.name = clientName.value
  client.personalEmail = personalEmail.value
  client.phoneNumber = handlePhoneNumber()
  client.date = date.value
  client.time = time.value
  client.description = description.value
  client.timeZone = timeZone
  client.method = method.value

  if (client.method === 'Office visit') {
    const location = document.getElementById('location').value

    if (location === 'Manila') {
      client.preferredBranch = ''
    } else if (location === 'Laguna') {
      client.preferredBranch = ''
    } else if (location === 'Gen. Trias Cavite') {
      client.preferredBranch =
        'Blk98 Lot25 Beaumont Street, Village 3 Metro South Subdivision, General Trias, 4107 Cavite'
    }
  }

  scheduledAppointmentInfo()

  // Create a Date object in local time
  let localDateTime = new Date(`${client.date}T${client.time}:00`)
  // Calculate the end time (60 minutes later) in UTC
  let endDateTime = new Date(
    localDateTime.getTime() + CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME * 60000
  ).toISOString()

  let requestOptions = {
    method: eventId ? 'PUT' : 'POST', // Use PUT if eventId exists, otherwise POST
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify({
      summary: 'Client Meeting',
      location:
        client.method === 'Google meeting'
          ? GOOGLE_MEET_LINK
          : client.method === 'Office visit'
          ? client.preferredBranch
          : '',
      description: `<strong>Method</strong>\n${client.method}\n\n<strong>What</strong>\n60 Mins Meeting between Ron Clarin and ${client.name}\n\n<strong>Invitee Time Zone</strong>\n${client.timeZone}\n\n<strong>Contact no.</strong>\n+${client.phoneNumber}\n\n<strong>Who</strong>\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${client.name}\n<a href="mailto:${client.personalEmail}">${client.personalEmail}</a>\n\n<strong>Additional Notes</strong>\n${client.description}`,

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

  const apiUrl = eventId
    ? `https://v1.nocodeapi.com/rocappointments1/calendar/MFItuKvjPMtspETk/event?eventId=${eventId}&sendNotifications=true&sendUpdates=all`
    : `https://v1.nocodeapi.com/rocappointments1/calendar/MFItuKvjPMtspETk/event?sendNotifications=true&sendUpdates=all`

  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result) // Log result for debugging
      if (!eventId) {
        eventId = result.id // Update eventId from the API response
        localStorage.setItem('eventId', eventId) // Store eventId persistently
      }
    })
    .catch(error => console.log('error', error))
}

function scheduledAppointmentInfo() {
  methodMeetingInfo.innerHTML = client.method
  if (client.method === 'Google meeting') {
    locationMeetingInfo.innerHTML = `<a href=${GOOGLE_MEET_LINK} target="_blank">${GOOGLE_MEET_LINK}</a>`
  } else if (client.method === 'Office visit') {
    locationMeetingInfo.innerHTML = client.preferredBranch
  }
  whatMeetingInfo.innerHTML = `60 Mins Meeting between Ron Clarin and ${client.name}`
  timeZoneMeetingInfo.innerHTML = `${client.timeZone}`
  contactMeetingInfo.innerHTML = `+${client.phoneNumber}`
  whoMeetingInfo.innerHTML = `Ron Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}"><br>${CEO_APPOINTMENT_EMAIL}</a><br><br>${client.name}\n<a href="mailto:${client.personalEmail}"><br>${client.personalEmail}</a>`
  additionalMeetingInfo.innerHTML = `${client.description}`
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
    `https://v1.nocodeapi.com/rocappointments1/calendar/MFItuKvjPMtspETk/event?eventId=${eventId}&sendNotifications=true&sendUpdates=all`,
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
    width: 40vw !important;
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
