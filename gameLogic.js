$(document).ready(function(){
  var game = new Game();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('#reset_all').hide();
  $('.player_turn').animate({opacity: 0 }, 50 );
  $('.wins').hide();
});

const PlaySymbolEnum = Object.freeze({cross:"X", nought:"O" });
const PlayerTurnEnum = Object.freeze({PlayerOne:1, PlayerTwo:2 });

var Game = function() {
  this.PlayerOne = new Player();
  this.PlayerTwo = new Player();
  this.WhosTurn = PlayerTurnEnum.PlayerOne;
  this.WinningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  this.Board = [0,1,2,3,4,5,6,7,8];
  this.eventListeners();
}

var Player = function() {
  this.IsBot = false;
  this.PlaySymbol;
  this.Wins = 0;
}

Game.prototype.eventListeners = function() {
  $("#button_players_one").click(function(event){
    event.preventDefault();
    this.PlayerTwo.IsBot = true;
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

  $("#reset_all").click(function(event){
    event.preventDefault();
    this.resetAll();
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

Game.prototype.play = function(elementId) {
  var index
  if(!$('#'+elementId).hasClass("has_symbol")) {
    if(this.WhosTurn == PlayerTurnEnum.PlayerOne) {
      this.WhosTurn = PlayerTurnEnum.PlayerTwo;
      this.setPlayerMoveToBoardArray(this.PlayerOne, elementId);
      this.checkIfPlayerWinsWinner(this.PlayerOne, elementId, PlayerTurnEnum.PlayerOne);
    } else if(this.WhosTurn == PlayerTurnEnum.PlayerTwo) {
      this.WhosTurn = PlayerTurnEnum.PlayerOne;
      this.setPlayerMoveToBoardArray(this.PlayerTwo, elementId);
      this.checkIfPlayerWinsWinner(this.PlayerTwo, elementId, PlayerTurnEnum.PlayerTwo);
    }

    if(this.PlayerTwo.IsBot) {
      index = this.miniMax(this.Board, this.PlayerTwo);
    }
    playerTitleToShow(this.WhosTurn);
    this.checkIsDraw();
  }
}

Game.prototype.setPlayerMoveToBoardArray = function(player, elementId) {
  var elementValue = parseInt($('#'+elementId).attr('value'));
  var index = this.Board.indexOf(elementValue);
  if(index !== -1) {
    this.Board[index] = player.PlaySymbol;
  }
}

function emptyIndexies(board){
  return  board.filter(s => s != PlaySymbolEnum.cross && s != PlaySymbolEnum.nought);
}

Game.prototype.miniMax = function(newBoard, player) {
  //available spots
  var availSpots = emptyIndexies(newBoard);

  if (this.isWinner(newBoard, this.PlayerOne)){
     return {score:-10};
  }
	else if (this.isWinner(newBoard, this.PlayerTwo)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

  var moves = []

  for (var i = 0; i < availSpots.length; i++) {
    array[i]
  }
}

Game.prototype.isWinner = function(player, board) {
  var emptySpots = emptyIndexies(this.Board)
  if(emptySpots.length > 4) return false;
  for(i = 0; i < this.WinningCombinations.length; i++) {
    var playerWinPoints = 0;
    $.each(this.WinningCombinations[i], function(index, element){
      if(board[element].toString() == player.PlaySymbol) {
        playerWinPoints++;
      }
    });
    if(playerWinPoints == this.WinningCombinations[i].length) {
      return true;
    }
  }
  return false;
}

Game.prototype.checkIfPlayerWinsWinner = function(player, elementId, playerNum) {
  this.printSymbolToBoard(player.PlaySymbol, elementId)
  if(this.isWinner(player, this.Board)) {
    this.winMessage(player, this.WinningCombinations[i], playerNum)
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

Game.prototype.checkIsDraw = function() {
  if($('.has_symbol').length == 9) {
    this.reset();
  }
}

Game.prototype.winMessage = function(player, allWinValues, playerNum) {
  $.each(allWinValues, function(index, value) {
    $('.play[value="'+value+'"]').animate({
      backgroundColor: '#9D2599'
    }, 200 );
  });
  displayWinMessage(playerNum)
  player.Wins++;
  playerTitleToShow(playerNum, true);
  this.addToPlayerScore(player.Wins, playerNum);
  this.reset();
}

Game.prototype.addToPlayerScore = function(wins, playerNum) {
  $("#"+playerNum.toString()).html(wins).show(400);
}

Game.prototype.reset = function() {
  this.Board = [0,1,2,3,4,5,6,7,8];
  this.WhosTurn = PlayerTurnEnum.PlayerOne;
  playerTitleToShow(this.WhosTurn);
  $(".has_symbol").empty();
  $('.has_symbol').animate({ backgroundColor: '#99ff99' }, 400 );
  $(".has_symbol").removeClass("has_symbol");
  $('.player_turn h3').animate({backgroundColor: '#99ff99' }, 200 );
}

Game.prototype.resetAll = function() {
  this.reset();
  this.PlayerOne = new Player();
  this.PlayerTwo = new Player();
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('#reset_all').hide();
  $('.player_turn').animate({opacity: 0 }, 50 );
  $('.wins').hide();
  $('#number_player_selection').show(500);
}

function displayWinMessage(playerNum) {
  $(".container").append("<h1 id='winner'>Player "+playerNum+" WINS!!!!</h1>");
  $("#winner").hide();
  $("#winner").show(600,'easeOutBounce');
  setTimeout(function(){
    $("#winner").remove();
  }, 1500);
}

function playerTitleToShow(player, winner = false) {
  if(player == PlayerTurnEnum.PlayerTwo) {
    playerTurnTitle(0, 0.9);
    if(winner) { $('#p_two').animate({backgroundColor: '#ED73F2' }, 200 ); }
  } else if(player == PlayerTurnEnum.PlayerOne) {
    playerTurnTitle(0.9, 0);
    if(winner) { $('#p_one').animate({backgroundColor: '#ED73F2' }, 200 ); }
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
    $('#reset_all').show(400);
    $('.player_turn').animate({opacity: 0.9 }, 400 );
    $('#p_two').animate({opacity: 0 }, 50 );
  }

}
