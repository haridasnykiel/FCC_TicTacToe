$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();


});


var Game = function() {
  this.PlayerOne = "";
  this.PlayerTwo = "";
  this.eventListeners();
}

Game.prototype.eventListeners = function() {
  $("#button_players_one").click(function(event){
    event.preventDefault();
    setPlayers("human", "bot");
  });

  $("#button_players_two").click(function(event){
    event.preventDefault();
    setPlayers("human", "human");
  });

  function setPlayers(playerOne, playerTwo) {
    this.PlayerOne = playerOne;
    this.PlayerTwo = playerTwo;
    nextPage(2);
  }

}

function nextPage(pageNum) {
  if(pageNum = 2) {
    $('#number_player_selection').hide(400);
    $('#select_nought_or_cross').show(400);
  } else if(pageNum = 3) {
    $('#game_in_play').show(400);
    $('#select_nought_or_cross').hide(400);
  }

}
