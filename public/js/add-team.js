var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    var postData = {
      teamName: $('#teamName').val(),
      cityLocation: $('#cityLocation').val(),
      stateLocation: $('#stateLocation').val(),
      coachId: localStorage.getItem('coachId')
    };

    if ( $('.required').val().length === 0) {
      $('.add-team-error-notification').slideDown('fast');
      window.setTimeout(closeWarningMessage, 3000);

      function closeWarningMessage() {
        $('.add-team-error-notification').slideUp('fast');
      }

      return;
    } else {

      $.ajax({
        type: 'POST',
        url: APP_URL + 'teams/',
        data: JSON.stringify(postData),
        success: function(data) {
          $('.add-team-notification').slideDown('fast');
          window.setTimeout(closeNotification, 2000);

          function closeNotification() {
            $('.add-team-notification').slideUp('fast');
          }
          window.setTimeout(redirect, 3000)

          function redirect(){
            location.href = '/team-list.html'
          }
        },
        contentType: "application/json",
        dataType: 'json'
      });
    }
  })
})
