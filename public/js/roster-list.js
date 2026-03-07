var APP_URL = window.location.origin + '/'

var state = {
  teams: [],
}

var coachId = localStorage.getItem('coachId')
$(document).ready(function () {
  $('.teams-list-notification').text('......Loading').show()
   $.get(APP_URL + 'coaches/' + coachId, function(data) {
     state.teams = data.teams
  $('.teams-list-notification').text(' ').hide()
    render()
  })

  function render() {
    var combinedPlayers = []
    var teams = state.teams.map(function(team) {

      var players = team.players

      players.map(function(playerData) {
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
          class: 'title',
          text: `${playerData.first_name} ${playerData.last_name}`
        })

        var playerEmail = $('<p>', {
          class: 'subtitle',
          text: `Email: ${playerData.email}`
        })

        var playerPosition = $('<p>', {
          class: 'subtitle',
          text: `Position: ${playerData.position}`

        })

        var playerTeam = $('<p>', {
          class: 'subtitle',
          text: `Team: ${team.name}`

        })

       // card footer
        var playerListFooter = $('<footer>', {
          class: 'card-footer panel-heading dashboard-team-list-footer'
        })

        var cardFooterItem = $('<p>', {
          class: 'card-footer-item'
        })

        var viewPlayerSpan = $('<span>');

        var viewPlayerFooterLink = $('<a>', {
          text: 'View Player Details',
          href: APP_URL + 'roster-list-player.html?id=' + playerData.id
        })

        // append card content
        cardContainer.append(cardContent)
        cardContent.append(playerName)
        playerName.append(playerEmail)
        playerEmail.append(playerPosition)
        playerPosition.append(playerTeam)

        //append card content to container
        columnContainer.append(cardContainer)

        //footer
        playerListFooter.append(cardFooterItem)
        cardFooterItem.append(viewPlayerSpan)
        viewPlayerSpan.append(viewPlayerFooterLink)

        // append footer to the main card container
        columnContainer.append(playerListFooter)

        combinedPlayers.push(columnContainer)
        // return columnContainer
    })
        $('.team-list-details-page').html(combinedPlayers)
         })
      }
    })
