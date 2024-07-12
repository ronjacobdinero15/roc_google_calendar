function submitForm(event) {
  event.preventDefault()

  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  var date = document.getElementById('date').value
  var time = document.getElementById('time').value
  var gmt = document.getElementById('gmt').value
  var dateTime = `${date}T${time}:00${gmt}`

  var formData = {
    summary: document.getElementById('name').value,
    description: document.getElementById('additionalInfo').value,
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
    attendees: [{ email: document.getElementById('email').value }],
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
