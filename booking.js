const CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME = 60 // 1 Hour
const CEO_APPOINTMENT_EMAIL = 'roc.appointments@gmail.com'

function submitForm(event) {
  event.preventDefault()

  bookedModal()

  // NOTE: Make use of phoneNumber
  const phoneNumber = handlePhoneNumber()

  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  var name = document.getElementById('name').value
  var email = document.getElementById('email').value
  var date = document.getElementById('date').value
  var time = document.getElementById('time').value
  var description = document.getElementById('description').value
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Create a Date object in local time
  var localDateTime = new Date(`${date}T${time}:00`)

  // Convert local time to UTC
  var utcDateTime = localDateTime.toISOString()

  // Calculate the end time (30 minutes later) in UTC
  var utcEndDateTime = new Date(
    localDateTime.getTime() + CEO_PREFERRED_MINIMUM_APPOINTMENT_TIME * 60000
  ).toISOString()

  var formData = {
    summary: 'Client Meeting',
    // TODO: Must create a meeting link
    // TODO: Must email the client about this link
    description: `What:\n60 Mins Meeting between <strong>Ron Clarin</strong> and <strong>${name}</strong>\n\nInvitee Time Zone:\n${timeZone}\n\nContact no.:\n+${phoneNumber}\n\nWho:\n\nRon Clarin - Organizer\n<a href="mailto:${CEO_APPOINTMENT_EMAIL}">${CEO_APPOINTMENT_EMAIL}</a>\n\n${name}\n<a href="mailto:${email}">${email}</a>\n\nAdditional Notes:\n${description}`,
    start: {
      dateTime: utcDateTime,
      timeZone: 'UTC', // Use UTC time zone for Google Calendar API
    },
    end: {
      dateTime: utcEndDateTime,
      timeZone: 'UTC', // Use UTC time zone for Google Calendar API
    },
    attendees: [{ email }],
  }

  var requestOptions = {
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
  var input = document.querySelector('#phone')

  // Get the selected country code using the intlTelInput API
  var countryCode = iti.getSelectedCountryData().dialCode

  return countryCode + input.value
}

function bookedModal() {
  var modal = document.getElementById('bookedModal')

  // Simulate form submission (replace with actual fetch or POST request)
  setTimeout(function () {
    modal.style.display = 'block'
  }, 500) // Just for demo purposes, replace with actual submission logic

  // Close modal when close button or outside modal area is clicked
  var span = document.getElementsByClassName('close')[0]
  span.onclick = function () {
    modal.style.display = 'none'
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }
}
