function addGuest() {
  const emailContainer = document.querySelector('.emailContainer')
  const guestEmailContainer = document.createElement('div')
  guestEmailContainer.classList.add('guestEmailContainer')

  guestEmailContainer.innerHTML = `
        <input type="email" class="email guestEmail" name="email" placeholder="Guest Email" autocomplete="off" required/>
        <button class="deleteButton" onclick="deleteGuest()">&times;</button>
      `

  emailContainer.appendChild(guestEmailContainer)

  const deleteButton = guestEmailContainer.querySelector('.deleteButton')
  deleteButton.addEventListener('click', function () {
    guestEmailContainer.remove()
  })
}

document.getElementById('addGuest').addEventListener('click', addGuest)
