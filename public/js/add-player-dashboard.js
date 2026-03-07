var APP_URL = window.location.origin + '/'

$(document).ready(function() {

  $('.addPlayerButton').on('click', function() {
    $('.add-player-modal').addClass('is-active').fadeIn('slow')
  })

  $('.form-trigger-add-player').on('click', function(e) {
    e.preventDefault()
    var postData = {
      email: $('#playerEmail').val(),
      first_name: $('#firstName').val(),
      last_name: $('#lastName').val(),
      position: $('#playerPosition').val()
    }

    if ($('.new-player .required').val().length === 0) {
      $('.add-team-error-notification').slideDown('fast')
      window.setTimeout(closeWarningMessage, 3000)

      function closeWarningMessage() {
        $('.add-team-error-notification').slideUp('fast')
      }

      return;
    } else {
      var coachId = getParameterByName('id') || $('.select-teams').val();
      $.ajax({
        type: 'POST',
        url: APP_URL + teamId + '/player/',
        data: JSON.stringify(postData),
        success: function(data) {
          $('.add-team-notification').slideDown('fast')
          window.setTimeout(closeNotification, 2000)

          function closeNotification() {
            $('.add-team-notification').slideUp('fast')
          }
          window.setTimeout(reload, 3000)

          function reload() {
            location.href = APP_URL + 'dashbaord.html?=' + coachId
          }
        },
        fail: function() {
          alert('Add player function fail, please try again.')
        },
        contentType: 'application/json',
        dataType: 'json'
      })
    }
  })
  $('.delete').on('click', function() {
    $('.modal').hide()
  })
})

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
