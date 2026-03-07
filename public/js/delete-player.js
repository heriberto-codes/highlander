var APP_URL = window.location.origin + '/'

$(document).ready(function() {
  console.log('I am ready to delete a team')

  var coachId = localStorage.getItem('coachId')
  $.ajax({
    type: 'GET',
    url: APP_URL + 'coaches/' + coachId,
    success: function(data) {
      console.log(data)
      var coachDetails = data.teams.map(function(team) {
        console.log('teams', team);
        console.log('teams', team.players);

        var player = team.players;

        var teamMember = player.map(function(player) {
          console.log('the players', player)
          var fullName = player.first_name + ' ' + player.last_name

          return '<option value="' + player.id + '">' + fullName + '</option>'
        })
        $('.select-team').append(teamMember)
       })
    },
    fail: function() {
      alert('Load team drop down function broke')
    }
  })

  $('.form-trigger-delete-team').on('click', function(e) {
    e.preventDefault()
    console.log('Team Deleted');

    // var teamId = getParameterByName('teamId') || $('.select-team').val();
    var playerId = getParameterByName('playerId') || $('.select-team').val();
    var coachId = localStorage.getItem('coachId');
    $.ajax({
      type: 'DELETE',
      url: APP_URL + 'players/' + playerId,
      success: function() {
        console.log('Hello we got to the success call back')
        location.href = APP_URL + 'dashboard.html?id=' + coachId;
      },
      fail: function () {
        alert('Delete function failed')
      }
    })
  })
})

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
