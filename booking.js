function submitForm(event) {
  event.preventDefault()

  bookedModal()

  // NOTE: Make use of phoneNumber
  const phoneNumber = handlePhoneNumber()
  alert(phoneNumber)

  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  var name = document.getElementById('name').value
  var email = document.getElementById('email').value
  var phone = document.getElementById('phone').value // Uncommented
  var date = document.getElementById('date').value
  var time = document.getElementById('time').value
  var gmt = document.getElementById('gmt').value
  var description = document.getElementById('description').value
  var dateTime = `${date}T${time}:00${gmt}`

  var formData = {
    summary: name,
    description,
    start: {
      dateTime: dateTime,
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: new Date(
        new Date(dateTime).getTime() + 30 * 60000
      ).toISOString(),
      timeZone: 'Asia/Manila',
    },
    // NOTE: ADD GUEST EMAILS (OPTIONAL)
    attendees: [{ email }],
    phone: phone, // Include phone number in formData
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(formData),
  }

  fetch(
    'https://v1.nocodeapi.com/ronjacobdinero15/calendar/fWxRyAQXGGAWfntR/event',
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
  // NOTE: BOOKED MODAL
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
  // END OF BOOKED MODAL
}
