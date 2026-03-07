var APP_URL = window.location.origin + '/'
// single state object
 var state = {
  teamId: null,
  team: {
    name: null,
    city: null,
    state: null
  },
  coach: [],
  players: []
 }

 var teamId = getParameterByName('id');
 $(document).ready(function() {
   $('.team-details-notification').text('......Loading').show();
   $.get(APP_URL + 'teams/' + teamId, function(data) {
     state.team.city = data.city
     state.team.state = data.state
     state.team.name = data.name
     state.coach = data.coach
     state.players = data.players
     $('.team-details-notification').html('').hide();
     render()
   })
 })

function render() {

  var coachDetails = state.coach.map(function(dataCoach){
    var coachName = dataCoach.first_name + ' ' + dataCoach.last_name
    var coachEmail = dataCoach.email

    $('.coach-name').text(coachName)
    $('.coach-email').text(coachEmail)
  })

  var teamName = state.team.name
  var teamLocation = state.team.city + ', ' + state.team.state

  $('.team-name').text(teamName)
  $('.team-location').text(teamLocation)

  var listOfPlayers = state.players.map(function(dataPlayers){
    var columnContainer = $('<div>', {
      class: 'card-list'
    })

    var cardContainer = $('<div>', {
      class: 'card has-text-centered'
    })

    var cardContent = $('<div>', {
      class: 'card-content',
      id: 'theTeamBg'
    })

    var playerName = $('<p>', {
      class: 'title team-name',
      text: dataPlayers.first_name + ' ' + dataPlayers.last_name
    })

    var playerEmail = $('<p>', {
      class: 'subtitle team-city-state',
      text: dataPlayers.email
    })

    var playerPosition = $('<p>', {
      class: 'subtitle team-city-state',
      text: dataPlayers.position
    })

    // card footer
    var teamListFooter = $('<footer>', {
      class: 'card-footer panel-heading dashboard-team-list-footer'
    })

    var cardFooterItem = $('<p>', {
      class: 'card-footer-item'
    })

    var viewPlayerSpan = $('<span>');

    var viewPlayerFooterLink = $('<a>', {
      text: 'View Player Details',
      href: APP_URL + 'roster-list-player.html?id=' + dataPlayers.id
    })

    // append card content
    cardContainer.append(cardContent)
    cardContent.append(playerName)
    playerName.append(playerEmail)
    playerEmail.append(playerPosition)

    //append card content to container
    columnContainer.append(cardContainer)

    //footer
    teamListFooter.append(cardFooterItem)
    cardFooterItem.append(viewPlayerSpan)
    viewPlayerSpan.append(viewPlayerFooterLink)

    // append footer to the main card container
    columnContainer.append(teamListFooter)

    return columnContainer
  })
  $('.team-details-page').html(listOfPlayers)
}


 function getParameterByName(name) {
     var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
     return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
 }
