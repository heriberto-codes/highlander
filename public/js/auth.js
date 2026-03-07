var APP_URL = 'http://localhost:8080/';

$(document).ready(function() {
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var publicPages = {
    'index.html': true,
    'login.html': true,
    'register.html': true
  };

  $.ajaxSetup({
    beforeSend: function(xhr) {
      var token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }
  });

  if (!publicPages[currentPath] && !localStorage.getItem('authToken')) {
    window.location.href = APP_URL + 'login.html';
  }

  $(document).ajaxError(function(event, xhr) {
    if (xhr && xhr.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('coachId');
      window.location.href = APP_URL + 'login.html';
    }
  });
});
