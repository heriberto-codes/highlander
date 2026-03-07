var APP_URL = window.location.origin + '/'

var state = {
  playerId: null,
  teams: [],
  player: null,
  stats:{
        'Hits': 0,
        'At Bats': 0,
        'Home Runs': 0,
        'Earned Runs': 0,
        'Innings Pitched': 0,
        'Strikeouts': 0
      }
}

$(document).ready(function () {
  var playerId = getParameterByName('id')
  $.get(APP_URL +'players/' + playerId, function(data) {
    state.teams = data.teams;
    state.player = data;
    $.get(APP_URL + 'players/' + playerId + '/stats', function(data) {
      data.stats.map(function(stat){
        state.stats[stat.catalog.description] = stat.how_many;
      });
      render()
    })
  })
})

function render(){
  var teamsElements = state.teams.map(function(team) {

    var listTeam = $('<li>', {
      class: "panel-heading"
    })
    var linkTeam = $('<a>', {
      text: team.name,
      href: APP_URL + 'team-details.html?id=' + team.id
    })
    listTeam.append(linkTeam)

    return listTeam
  })
  $('.teams-list-container').html(teamsElements)

    var fullName = state.player.first_name + ' ' + state.player.last_name
    var playerEmail = state.player.email
    var playerPosition = state.player.position

    $('.coach-fullname').text(fullName)
    $('.coach-email').text(playerEmail)
    $('.stats-pos').text(playerPosition)

    $('.stats-hits').text(state.stats['Hits']);
    $('.stats-at-bats').text(state.stats['At Bats']);
    $('.stats-home-runs').text(state.stats['Home Runs']);
    $('.stats-earned-runs').text(state.stats['Earned Runs']);
    $('.stats-innings-pitched').text(state.stats['Innings Pitched']);
    $('.stats-strikeouts').text(state.stats['Strikeouts']);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}
