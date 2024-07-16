let rescheduleActive = false

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
      <button id="reschedule" onclick="rescheduleAppointment()">Reschedule</button>
      <button id="cancel" onclick="cancelAppointment()">Cancel</button>
    </div>
  `
    scheduledAppointmentContainer.appendChild(detailsContainer)

    rescheduleActive = true
  }
}
