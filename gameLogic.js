$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('.player_turn').animate({opacity: 0 }, 100 );


});

var Game = function() {
  this.PlayerOne = new Player();
  this.PlayerTwo = new Player();
  this.WhosTurn = "One";
  this.winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]
  this.eventListeners();
}

var Player = function() {
  this.IsBot = false;
  this.PlaySymbol = "";
  this.Moves = [];
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

  $(".play").click(function(event){
    event.preventDefault();
    var eventTarget = event.currentTarget.attributes[2].nodeType
    this.play(eventTarget);
  }.bind(this));

}

Game.prototype.setSymbols = function(symbolName) {
  if(symbolName == "X") {
    this.PlayerOne.PlaySymbol = "X"
    this.PlayerTwo.PlaySymbol = "O"
  } else if(symbolName == "O") {
    this.PlayerOne.PlaySymbol = "O"
    this.PlayerTwo.PlaySymbol = "X"
  }
}

Game.prototype.setBotPlayer = function(isBot) {
  this.PlayerTwo.IsBot = isBot;
}

Game.prototype.play = function(elementValue) {
  if(this.WhosTurn = "One") { //Look into enums for the play symbol and the whos turn symbol. 
    if(this.PlayerOne.PlaySymbol == "X") {
      $('.play :input[value='+elementValue+']').prepend('<img src="./images/cross.png" />'); // This is not adding the image to the div element.
    }
  }
}

function nextPage(pageNum) {
  if(pageNum == 2) {
    $('#number_player_selection').hide(400);
    $('#select_nought_or_cross').show(400);
  } else if(pageNum == 3) {
    $('#game_in_play').show(400);
    $('#select_nought_or_cross').hide(400);
    $('.player_turn').animate({opacity: 0.9 }, 400 );
    $('#p_two').animate({opacity: 0 }, 50 );
  }

}
