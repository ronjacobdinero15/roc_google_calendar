var input = document.querySelector('#phone')
var iti = window.intlTelInput(input, {
  initialCountry: 'ph',
  separateDialCode: true,
  preferredCountries: ['ph', 'us', 'gb', 'au'], // Specify the preferred countries
})
