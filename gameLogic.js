$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('.player_turn').animate({opacity: 0 }, 100 );


});


var Game = function() {
  this.PlayerOne = new Player();
  this.PlayerTwo = new Player();
  this.eventListeners();
}

var Player = function() {
  this.IsBot = false;
  this.PlaySymbol = "";
}

Game.prototype.eventListeners = function() {
  $("#button_players_one").click(function(event){
    event.preventDefault();
    this.setBotPlayer(true);
    nextPage(2);
  }.bind(this));

  $("#button_players_two").click(function(event){
    event.preventDefault();
    nextPage(2);
  }.bind(this));

  $(".symbol").click(function(event){
    event.preventDefault();
    this.setSymbols($(".symbol").val());
    nextPage(3);
  }.bind(this));

}

Game.prototype.setSymbols = function(symbolName) {
  if(symbolName == "cross") {
    this.PlayerOne.PlaySymbol = "cross"
    this.PlayerTwo.PlaySymbol = "nought"
  } else if(symbolName == "nought") {
    this.PlayerOne.PlaySymbol = "nought"
    this.PlayerTwo.PlaySymbol = "cross"
  }
}

Game.prototype.setBotPlayer = function(isBot) {
  this.PlayerTwo.IsBot = isBot;
}

function nextPage(pageNum) {
  if(pageNum == 2) {
    $('#number_player_selection').hide(400);
    $('#select_nought_or_cross').show(400);
  } else if(pageNum == 3) {
    $('#game_in_play').show(400);
    $('#select_nought_or_cross').hide(400);
    $('#p_one').animate({opacity: 0.9 }, 400 ); // This line is not being called. Requires investigation.
  }

}
