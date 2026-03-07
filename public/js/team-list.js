var APP_URL = window.location.origin + '/'

var state = {
  teams: []
}

$(document).ready(function(){
  $('.teams-list-notification').text('......Loading').show()
  $.get(APP_URL + 'teams/', function(data){
    console.log('data from initial get ajax call ===>', data);
    state.teams = data
    console.log(state.teams)
    $('.teams-list-notification').text(' ').hide()
    render()
  })
})

var teamId = getParameterByName('id')
function render() {
  //render teams
    var teamList = state.teams.map(function(teamInfo) {
      console.log(teamInfo)
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

      var teamName = $('<p>', {
        class: 'title team-name',
        text: teamInfo.name
      })

      var teamCity = $('<p>', {
        class: 'subtitle team-city-state',
        text: teamInfo.city + ' ' + teamInfo.state
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
        text: 'View Team Details',
        href: APP_URL + 'team-details.html?id=' + teamInfo.id
      })

      // append card content
      cardContainer.append(cardContent)
      cardContent.append(teamName)
      teamName.append(teamCity)
      // teamCity.append(teamList)

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
    $('.team-list-details-page').html(teamList)
    $('.teams-list-notification').remove();
}

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}
