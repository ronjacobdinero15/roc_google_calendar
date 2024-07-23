const dateInput = document.getElementById('date')
const timeInput = document.getElementById('time')

function toggleTimeInput() {
  if (dateInput.value) {
    timeInput.disabled = false
  } else {
    timeInput.disabled = true
    timeInput.value = ''
  }
}

dateInput.addEventListener('change', toggleTimeInput)

const availableTimes = {
  Sun: [],
  Mon: ['08:00', '16:00'],
  Tue: ['08:00', '16:00'],
  Wed: ['08:00', '16:00'],
  Thu: ['08:00', '16:00'],
  Fri: ['08:00', '16:00'],
  Sat: ['08:00', '16:00'],
}

flatpickr(dateInput, {
  altInput: true,
  altFormat: 'F j, Y',
  dateFormat: 'Y-m-d',
  minDate: 'today',
  disable: [
    function (date) {
      // Disable Sundays
      return date.getDay() === 0
    },
  ],
  onChange: function (selectedDates, dateStr, instance) {
    const dayOfWeek = new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
    })

    const times = availableTimes[dayOfWeek]
    if (times) {
      timeInput._flatpickr.set('minTime', times[0])
      timeInput._flatpickr.set('maxTime', times[1])
    } else {
      timeInput._flatpickr.set('minTime', '00:00')
      timeInput._flatpickr.set('maxTime', '00:00')
    }
  },
})

flatpickr(timeInput, {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:00',
  time_24hr: false,
  minuteIncrement: 60,
})
