$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('.player_turn').animate({opacity: 0 }, 50 );
  $('.wins').animate({opacity: 0}, 50 );
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
  this.Wins = 0;
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
  if(!$('#'+elementId).hasClass("has_symbol")) {
    if(this.WhosTurn == PlayerTurnEnum.PlayerOne) {
      this.WhosTurn = PlayerTurnEnum.PlayerTwo;
      this.PlayerOne.Moves.push(parseInt($('#'+elementId).attr('value')));
      this.checkWinner(this.PlayerOne, elementId, PlayerTurnEnum.PlayerOne);
    } else if(this.WhosTurn == PlayerTurnEnum.PlayerTwo) {
      this.WhosTurn = PlayerTurnEnum.PlayerOne;
      this.PlayerTwo.Moves.push(parseInt($('#'+elementId).attr('value')));
      this.checkWinner(this.PlayerTwo, elementId, PlayerTurnEnum.PlayerTwo);
    }
    playerTitleToShow(this.WhosTurn);
  }
}

Game.prototype.printSymbolToBoard = function(playerSymbol, elementId) {
  if(playerSymbol == PlaySymbolEnum.cross) {
    $('#'+elementId).prepend('<img src="./images/cross.png" />');
  } else if(playerSymbol == PlaySymbolEnum.nought) {
    $('#'+elementId).prepend('<img src="./images/nought.png" />');
  }
  $('#'+elementId).addClass("has_symbol").css("background-color", "#79876c");
}

Game.prototype.checkWinner = function(player, elementId, playerNum) {
  this.printSymbolToBoard(player.PlaySymbol, elementId)
  if(player.Moves.length < 3) return
  for(i = 0; i < this.WinningCombinations.length; i++) {
    var playerWinPoints = 0;
    $.each(this.WinningCombinations[i], function(index, element){
      if(player.Moves.indexOf(element) != -1) {
        playerWinPoints++;
      }
    });
    if(playerWinPoints == this.WinningCombinations[i].length) {
      this.winMessage(player, this.WinningCombinations[i], playerNum)
      break;
    }
  }
}

Game.prototype.winMessage = function(player, allWinValues, playerNum) {
  $.each(allWinValues, function(index, value) {
    $('.play[value="'+value+'"]').animate({
      backgroundColor: '#9D2599'
    }, 200 );
  });
  player.Wins++;
  playerTitleToShow(playerNum, true);
  if(player.Wins >= 1) {
    this.addToPlayerScore(player.Wins, playerNum);
    this.reset();
  }

}

Game.prototype.addToPlayerScore = function(wins, playerNum) {
  $("#"+playerNum.toString()).html(wins).animate({
    opacity: 1,
  }, 400 );
}

Game.prototype.reset = function() {
  this.PlayerOne.Moves = [];
  this.PlayerTwo.Moves = [];
  this.WhosTurn = PlayerTurnEnum.PlayerOne;
  playerTitleToShow(this.WhosTurn);
  $(".has_symbol").empty();
  $('.has_symbol').animate({ backgroundColor: '#99ff99' }, 400 );
  $(".has_symbol").removeClass("has_symbol");
  $('.player_turn h3').animate({backgroundColor: '#99ff99' }, 200 );
}

function playerTitleToShow(player, isWinner = false) {
  if(player == PlayerTurnEnum.PlayerTwo) {
    playerTurnTitle(0, 0.9);
    if(isWinner) { $('#p_two').animate({backgroundColor: '#ED73F2' }, 200 ); }
  } else if(player == PlayerTurnEnum.PlayerOne) {
    playerTurnTitle(0.9, 0);
    if(isWinner) { $('#p_one').animate({backgroundColor: '#ED73F2' }, 200 ); }
  }
 
}

function playerTurnTitle(pOneOpacity, pTwoOpacity) {
  $('#p_two').animate({opacity: pTwoOpacity }, 200 );
  $('#p_one').animate({opacity: pOneOpacity }, 200 );
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
