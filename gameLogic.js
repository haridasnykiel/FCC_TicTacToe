$(document).ready(function(){
  var game = new Game();
  showPlayerSelection();
});

function showPlayerSelection() {
  $('#game_in_play').hide();
  $('#select_nought_or_cross').hide();
  $('#reset_all').hide();
  $('.player_turn').animate({opacity: 0 }, 50 );
  $('.wins').hide();
  $('#number_player_selection').show(500);
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
    playerTitleToShow(this.WhosTurn);
    this.checkIsDraw();
    if(this.PlayerTwo.IsBot && this.WhosTurn === PlayerTurnEnum.PlayerTwo) {
      var move = this.miniMax(this.Board, this.PlayerTwo);
      setTimeout($('.play[value="'+move.index+'"]').click(), 1000);
    }
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

  // checks for the terminal states such as win, lose, and tie
  //and returning a value accordingly
  if (this.isWinner(this.PlayerOne, newBoard)){
     return {score:-10};
  }
	else if (this.isWinner(this.PlayerTwo, newBoard)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

  var moves = [];

  for (var i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot
    var move = {};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player.PlaySymbol;

    /*collect the score resulted from calling minimax
      on the opponent of the current player*/
    if(player === this.PlayerTwo) {
      var result = this.miniMax(newBoard, this.PlayerOne);
      move.score = result.score;
    } else {
      var result = this.miniMax(newBoard, this.PlayerTwo);
      move.score = result.score;
    }

    // reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }
  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === this.PlayerTwo){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{
    // else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  // return the chosen move (object) from the moves array
  return moves[bestMove];
}

Game.prototype.isWinner = function(player, board) {
  if(emptyIndexies(this.Board).length > 4) return false;
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
    displayGameOverMessage("  ITS A TIE!!!!!!!!!!");
  }
}

Game.prototype.winMessage = function(player, allWinValues, playerNum) {
  $.each(allWinValues, function(index, value) {
    $('.play[value="'+value+'"]').animate({
      backgroundColor: '#9D2599'
    }, 200 );
  });
  displayGameOverMessage("Player "+playerNum+" WINS!!!!")
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
  showPlayerSelection();
}

function displayGameOverMessage(displayMessage) {
  $(".container").append("<h1 id='winner'>"+displayMessage+"</h1>");
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
