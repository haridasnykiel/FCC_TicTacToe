$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('.player_turn').animate({opacity: 0 }, 100 );


});

const PlaySymbolEnum = Object.freeze({cross:"X", nought:"O" });
const PlayerTurnEnum = Object.freeze({PlayerOne:1, PlayerTwo:2 });

var Game = function() {
  this.PlayerOne = new Player();
  this.PlayerTwo = new Player();
  this.WhosTurn = PlayerTurnEnum.PlayerOne;
  this.WinningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]
  this.eventListeners();
}

var Player = function() {
  this.IsBot = false;
  this.PlaySymbol;
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
    var symbol = event.currentTarget.attributes.value.nodeValue
    this.setSymbols(symbol);
    nextPage(3);
  }.bind(this));

  $(".play").click(function(event){
    event.preventDefault();
    this.play(event.currentTarget.id);
  }.bind(this));

}

Game.prototype.setSymbols = function(symbol) {
  if(symbol == "X") {
    this.PlayerOne.PlaySymbol = PlaySymbolEnum.cross
    this.PlayerTwo.PlaySymbol = PlaySymbolEnum.nought
  } else if(symbol == "O") {
    this.PlayerOne.PlaySymbol = PlaySymbolEnum.nought
    this.PlayerTwo.PlaySymbol = PlaySymbolEnum.cross
  }
}

Game.prototype.setBotPlayer = function(isBot) {
  this.PlayerTwo.IsBot = isBot;
}

Game.prototype.play = function(elementId) {
  if(this.WhosTurn == PlayerTurnEnum.PlayerOne) {
    this.printSymbolToBoard(this.PlayerOne.PlaySymbol, elementId)
    this.WhosTurn = PlayerTurnEnum.PlayerTwo
  } else if(this.WhosTurn == PlayerTurnEnum.PlayerTwo) {
    this.printSymbolToBoard(this.PlayerTwo.PlaySymbol, elementId)
    this.WhosTurn = PlayerTurnEnum.PlayerOne
  }
}

Game.prototype.printSymbolToBoard = function(playerSymbol, elementId) {
  if(playerSymbol == PlaySymbolEnum.cross) {
    $('#'+elementId).prepend('<img src="./images/cross.png" />');
  } else if(playerSymbol == PlaySymbolEnum.nought) {
    $('#'+elementId).prepend('<img src="./images/nought.png" />');
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
