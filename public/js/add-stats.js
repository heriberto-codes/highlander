var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  $('.add-new-stats-button').on('click', function() {
    $('.add-stat-modal').addClass('is-active').fadeIn('slow')
  })

  var coachId = localStorage.getItem('coachId') || $('.select-players').val(); // getParameterByName('id')
  var thePlayers;
  $.ajax({
    type: 'GET',
    url:  APP_URL + 'coaches/' + coachId,
    success: function(data) {
      $('.select-players').empty();
      var teams = data.teams.map(function(team) {
        var players = team.players
        thePlayers = players.map(function(dataPlayer, index) {

            return '<option value="' + dataPlayer.id + '">' + dataPlayer.first_name + ' '
            + dataPlayer.last_name + '</option>'
        })
        $('.select-players').append(thePlayers);
      })
    },
      fail: function() {
        alert('Select team Ajax call broke')
      }
    })

  // stat button
  $('.form-trigger-add-stat').on('click', function(e) {
    e.preventDefault()
    var postData = {
      how_many: $('#howMany').val()
    }

    if ($('.add-stat-modal .required').val().length === 0) {
      $('.add-stat-error-notification').slideDown('fast')
      window.setTimeout(closeNotification, 3000)

      function closeNotification() {
        $('.add-stat-error-notification').slideUp('fast');
      }

      return;
    } else {
        var playerId = getParameterByName('id') || $('.select-players').val();
        var statId = $('.stat-id').val();
        $.ajax({
          type: 'POST',
          url: APP_URL + 'players/' + playerId + '/stats/' + statId,
          data: JSON.stringify(postData),
          success: function(){
            $('.add-stat-notification').slideDown('fast')
            window.setTimeout(closeStatNotification, 2000)

            function closeStatNotification() {
              $('.add-stat-notification').slideUp('fast')
            }
            window.setTimeout(reload, 3000)

            function reload() {
              location.href = APP_URL + 'roster-list-player.html?id=' + playerId;
            }
          },
          fail: function() {
            alert('Create STAT function broke')
          },
          contentType: 'application/json',
          dataType: 'json'
        })
      }
    })
  })

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
