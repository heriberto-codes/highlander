var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  $('#edit-player-button').on('click', function() {
    $('.edit-player-modal').addClass('is-active').fadeIn('slow')
  })

  $('.form-trigger').on('click', function(e) {
    e.preventDefault()
    var postData = {
      first_name: $('#firstName').val(),
      last_name: $('#lastName').val(),
      email: $('#playerEmail').val(),
      position: $('#playerPosition').val(),
      team_id: $('team_id').val()
    }

  if ($('.required').val().length === 0) {
    $('.add-team-error-notification').slideDown('fast')
    window.setTimeout(closeWarningMessage, 3000)

    function closeWarningMessage() {
      $('.add-team-error-notification').slideUp('fast')
    }

    return;
  } else {
    var playerId = getParameterByName('id')
    $.ajax({
      type: 'PUT',
      url: APP_URL + 'players/' + playerId,
      data: JSON.stringify(postData),
      success: function(data){
        $('.add-team-notification').slideDown('fast')
        window.setTimeout(closeNotification, 2000)

        function closeNotification() {
          $('.add-team-notification').slideUp('fast')
        }
        window.setTimeout(reload, 3000)

        function reload() {
          location.reload()
        }
      },
      fail: function() {
        alert('Edit player function fail, please try again.')
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
