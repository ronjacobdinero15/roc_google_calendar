document.addEventListener('DOMContentLoaded', function () {
  const togglePoliciesModal = document.getElementById('togglePoliciesModal')
  const modal = document.getElementById('policiesModal')

  togglePoliciesModal.addEventListener('click', function (e) {
    e.preventDefault()
    modal.classList.toggle('active')
  })
})
