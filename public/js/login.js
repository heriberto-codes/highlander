var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  $('.login-button').on('click', function(e){
    e.preventDefault()
    const postData = {
      email: $('#email').val(),
      password: $('#password').val()
    }

    if ($('.required').val().length === 0) {
      $('.add-team-error-notification').slideDown('fast')
      window.setTimeout(closeWarningMessage, 3000)

      function closeWarningMessage() {
        $('.add-team-error-notification').slideUp('fast')
      }

      return;
    } else {
      $.ajax({
        type: 'POST',
        url: APP_URL + 'coaches/login',
        data: JSON.stringify(postData),
        success: function(response) {
            localStorage.setItem('authToken', response.token)
            localStorage.setItem('coachId', response.id)
            localStorage.setItem('showWelcomeMessage', 'true')
            location.href = APP_URL + 'dashboard.html'
        },
        error: function() {
          alert('Wrong password please try again')
        },
        fail: function() {
          alert('Create Coach function failed')
        },
        contentType: 'application/json',
        datatype: 'json'
      })
    }
  })

})
