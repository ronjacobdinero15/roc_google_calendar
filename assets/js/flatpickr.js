document.addEventListener('DOMContentLoaded', function () {
  const { DateTime } = luxon
  const dateInput = document.getElementById('date')
  const timeSelect = document.getElementById('time')
  const availableTimes = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ]

  function populateTimeSelect(localTimeZone) {
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select Time</option>'

    // Get current local date and time
    const now = DateTime.now().setZone(localTimeZone)
    const selectedDate = DateTime.fromISO(dateInput.value, {
      zone: localTimeZone,
    })

    // Convert available times to user's local time and disable past times
    availableTimes.forEach(time => {
      const localDateTime = DateTime.fromISO(
        `${selectedDate.toISODate()}T${time}:00`,
        { zone: 'Asia/Shanghai' }
      ).setZone(localTimeZone)

      const option = document.createElement('option')
      option.value = localDateTime.toFormat('HH:mm')
      option.textContent = localDateTime.toFormat('HH:mm')

      // Disable past times for the selected day
      if (selectedDate.toISODate() === now.toISODate() && localDateTime < now) {
        option.disabled = true
      }

      timeSelect.appendChild(option)
    })
  }

  function updateAvailableTimes() {
    const selectedDate = dateInput.value
    if (selectedDate) {
      const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      populateTimeSelect(localTimeZone)
    }
  }

  dateInput.addEventListener('change', updateAvailableTimes)

  flatpickr(dateInput, {
    altInput: true,
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d',
    minDate: 'today',
    disable: [
      date => date.getDay() === 0, // Disable Sundays
    ],
  })

  // Initial population if date is already set
  if (dateInput.value) {
    updateAvailableTimes()
  }
})
