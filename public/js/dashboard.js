var APP_URL = 'http://localhost:8080/'

$(document).ready(function () {

  var toggle = $('#nav-toggle');
  var menu = $('#nav-menu');

  $(toggle).click(function() {
    $(this).toggleClass('is-active');
    $(menu).toggleCLass('is-active');
  })

  var coachId = localStorage.getItem('coachId');
  if(!coachId) location.href= APP_URL + 'login.html';
  var showWelcomeMessage = localStorage.getItem('showWelcomeMessage') === 'true';
  if(!showWelcomeMessage) {
    $('.notification-container').hide();
  }
   $.get(APP_URL + 'coaches/' + coachId, function(data) {
     var listTeams = data.teams.map(function(team){
     var listTeam = $('<li class="panel-heading">')
     var linkTeam = $('<a>', {
         text: team.name,
         href: APP_URL + 'team-details.html?id='+ team.id
       })
       listTeam.append(linkTeam)

       return listTeam
     })

     var fullname = data.first_name + ' ' + data.last_name
     var userEmail = data.email

     $('.coach-fullname').text(fullname)
     $('.coach-email').text(userEmail)
     $('.teams-list-container').html(listTeams)

     var mergedListPlayers = []
     data.teams.map(function(team){

       var players = team.players

       players.map(function(player){
         var listPlayer = $('<div>', {
           class:"card has-text-centered"
         })
         var listPlayerContent = $('<div>',{
           class:"card-content",
           id: "theTeamBg"
         })

        // card content
         var listPlayerName = $('<p>', {
           class: 'title player-name',
           text: player.first_name + ' ' + player.last_name
         })
         var listPlayerEmail = $('<p>', {
           class: 'subtitle player-email',
           text: player.email
         })

         // card footer
         var listPlayerFooter = $('<footer>', {
           class: 'card-footer panel-heading dashboard-roster-footer',
         })

         var listPlayerContentFooter = $('<p>', {
           class: 'card-footer-item'
         })

         var editPlayerSpan = $('<span>');

         var editPlayerFooterLink = $('<a>', {
           text: 'View Player Details',
           href: APP_URL + 'roster-list-player.html?id=' + player.id
         })

         // append card content
         listPlayerContent.append(listPlayerName)
         listPlayerContent.append(listPlayerEmail)

         // append card content to main card container
         listPlayer.append(listPlayerContent)

         // append footer content
         listPlayerFooter.append(listPlayerContentFooter)
         listPlayerContentFooter.append(editPlayerSpan)
         editPlayerSpan.append(editPlayerFooterLink)

         // append footer content to main card container
         listPlayer.append(listPlayerFooter)

        // push to array
         mergedListPlayers.push(listPlayer)
       })
     })

   $('.player-details-dashboard-page').html(mergedListPlayers)
   $('.roster-dashboard-message').remove()

   // stats module
   var tableRow = $('<tr>')

   var position = $('<th>');
   var positionAbbr = $('<abbr>', {
     title: 'Position',
     text: 'Pos'
   })
   position.append(positionAbbr);

   var name = $('<th>');
   var nameAbbr = $('<abbr>', {
     title: 'Name',
     text: 'Name'
   })
   name.append(nameAbbr);

   var hits = $('<th>')
   var hitsAbbr = $('<abbr>', {
     title: 'Hits',
     text: 'Hits'
   })
   hits.append(hitsAbbr);

   var atBats = $('<th>')
   var atBatsAbbr = $('<abbr>', {
     title: 'At Bats',
     text: 'AB'
   })
   atBats.append(atBatsAbbr)

   var homeRuns = $('<th>')
   var homeRunsAbbr = $('<abbr>', {
     title: 'Home Runs',
     text: 'HR'
   })
   homeRuns.append(homeRunsAbbr)

   var earnedRuns = $('<th>')
   var earnedRunsAbbr = $('<abbr>', {
     title: 'Earned Runs',
     text: 'ER'
   })
   earnedRuns.append(earnedRunsAbbr)

   var inningsPitched = $('<th>')
   var inningsPitchedAbbr = $('<abbr>', {
     title: 'Inning Pitched',
     text: 'IP'
   })
   inningsPitched.append(inningsPitchedAbbr)

   var strikeOuts = $('<th>')
   var strikeOutsAbbr = $('<abbr>', {
     title: 'Strikeouts',
     text: 'Strikeouts'
   })
   strikeOuts.append(strikeOutsAbbr)

   tableRow.append(position)
   tableRow.append(name)
   tableRow.append(hits)
   tableRow.append(atBats)
   tableRow.append(homeRuns)
   tableRow.append(earnedRuns)
   tableRow.append(inningsPitched)
   tableRow.append(strikeOuts)

   $('.stat-header-details-container').html(tableRow)

   var mergeTeamStats = [];
   data.teams.map(function(team){
      team.players.map(function(player){
        var playerStats = {
          firstName: player.first_name || 'No firstname',
          lastName: player.last_name || 'No lastname',
          position: player.position || 'No position',
          'Hits':0,
          'At Bats':0,
          'Home Runs':0,
          'Earned Runs':0,
          'Innings Pitched':0,
          'Strikeouts': 0
        };
        player.stats.map(function(stat){
          playerStats[stat.catalog.description] = stat.how_many;
        });

        var row = $('<tr>');
        row.append($('<th>', {text: playerStats.position}));
        row.append($('<td>', {text: playerStats.firstName + ' ' + playerStats.lastName}));
        row.append($('<td>', {text: playerStats['Hits']}));
        row.append($('<td>', {text: playerStats['At Bats']}));
        row.append($('<td>', {text: playerStats['Home Runs']}));
        row.append($('<td>', {text: playerStats['Earned Runs']}));
        row.append($('<td>', {text: playerStats['Innings Pitched']}));
        row.append($('<td>', {text: playerStats['Strikeouts']}));

        mergeTeamStats.push(row)
        })
      });

      $('.stat-details-container').html(mergeTeamStats)
      $('.stats-module-dashboard-message').remove()
    })

    $( ".delete" ).click(function() {
      localStorage.setItem('showWelcomeMessage', 'false');
      $( ".notification-container" ).fadeOut( "slow", function() {
      });
    });
  })
