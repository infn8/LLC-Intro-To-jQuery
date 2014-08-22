  var host;
  var isAdmin = false;
  host = "http://infn8-sockets.nodejitsu.com/";
  if(window.location.hostname == "jquery.local" || window.location.hostname == "infinibook.local"){
    host = "infinibook.local:3000";
  }
  var socket = io(host);
$(document).ready(function() {
  
  $('.plus-button').click(function(){
    socket.emit('vote', { hash: window.location.hash, qty: 1 });
  });
  $('.minus-button').click(function(){
    socket.emit('vote', { hash: window.location.hash, qty: -1 });
  });
  socket.on('admin-login', function(result){
    if(result.admin){
      window.isAdmin = true;
      $('#socket-message').text("You are logged in as Admin");
    }
  });
  socket.on('client-login', function(result){
    if(result.connected){
      $('.controls button').removeAttr('disabled');
      setWatched(true);
    }
  });
  socket.on('disconnect', function(result){
      $('.controls button').attr('disabled', 'disabled');
      setWatched(false);
  });
  $(window).on('hashchange', function(event) {
    if(isAdmin){
      socket.emit('admin-hashchange', window.location.hash);
    }
  });
  socket.on('client-hashchange', function(newHash){
    if(isAdmin != true){
      // TODO:  check if opted out of follow mode
      window.location.hash = newHash;
    }
  });
  $(window).konami(function(){ 
    $('<div><h3>Login for admin rights</h3><p><label>Password: </label><input id="admin-login" type="password"></p><p><button id="admin-login-submit">Login</button></p><p id="socket-message"></p></div>').dialog({
      modal:true,
      title:'Konami Code Activated!',
      width: 700,
      height : 600,
      open: function( event, ui ) {
        setTimeout(function(){
          $('#admin-login').val('').focus();
        }, 500);
      }
    });
  });
  $('body').on('click', '#admin-login-submit', function(event) {
    event.preventDefault();
    socket.emit('admin-login', $('#admin-login').val());

    /* Act on the event */
  });
});

function setWatched(state){
  var btn = $(".watch-button");
  var icon = btn.find('.fa');
  if(state){
    btn.data('watching', true).attr('Title', 'Observation Mode On:  Click this button to turn off');
    icon.removeClass('fa-eye-slash').addClass('fa-eye');
  } else {
    btn.data('watching', false).attr('Title', 'Observation Mode Off:  Click this button to turn on');
    icon.removeClass('fa-eye').addClass('fa-eye-slash');
  }
}
