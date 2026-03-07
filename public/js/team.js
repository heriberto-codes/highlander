var APP_URL = window.location.origin + '/'

$(document).ready(function () {
  var teamId = getParameterByName('id');
      $.get(APP_URL + 'teams/' + teamId, function(data) {
        console.log(data);
          var listItems = data.players.map(function(player) {
          var listItem = $('<li>');
          var playerName = $('<p>', {
            text: player.first_name  + ' ' + player.last_name
          });
          var playerEmail = $('<p>', {
            text: player.email
          });
          listItem.append(playerName);
          listItem.append(playerEmail);
          return listItem;
        })
        $('.roster-details').append(listItems);

        var teamName = data.name;
        var teamLocation = data.location;

        $('.team-name').text(teamName);
        $('.team-location').text(teamLocation);

        var coachName = data.coach[0].first_name + ' ' + data.coach[0].last_name;
        var coachEmail = data.coach[0].email;

        $('.coach-name').text(coachName);
        $('.coach-email').text(coachEmail);

      })
    })

 function getParameterByName(name) {
     var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
     return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
 }
