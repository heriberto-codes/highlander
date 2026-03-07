var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  $('#myBtn').on('click', function() {
    $('.edit-team-modal').addClass('is-active').fadeIn('slow')
  })

  $('.form-trigger').on('click', function(e) {
    e.preventDefault()
    var postData = {
        name: $('#teamName').val(),
        city: $('#cityLocation').val(),
        state: $('#stateLocation').val()
    }

  if ($('.required').val().length === 0) {
    $('.add-team-error-notification').slideDown('fast')
    window.setTimeout(closeWarningMessage, 3000)

    function closeWarningMessage() {
      $('.add-team-error-notification').slideUp('fast')
    }

    return;
  } else {
    var teamId = getParameterByName('id')
    $.ajax({
      type: 'PUT',
      url: APP_URL + 'teams/' + teamId,
      data: JSON.stringify(postData),
      success: function(data){
        $('.add-team-notification').slideDown('fast')
        window.setTimeout(closeNotification, 2000)

        function closeNotification() {
          $('.add-team-notification').slideUp('fast')
        }
        window.setTimeout(reload, 3000)

        function reload() {
          location.reload();
        }
      },
      fail: function() {
        alert('Edit team function not processed please try again.')
      },
      contentType: 'application/json',
      dataType: 'json'
      })
    }
  })
  $('.delete').on('click', function(){
    $('.modal').hide()
  })
})

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
