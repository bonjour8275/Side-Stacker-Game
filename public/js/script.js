var socket = io();
var symbol;
$(function () {
  $(".board button").attr("disabled", true);
  $(".board button").on("click", makeMove);
  // Event is called when either player makes a move
  socket.on("move.made", function (data) {
    // Render the move
    $("#" + data.position).text(data.symbol);
    $("#" + data.nextId).addClass(data.nextClass);
    // If the symbol is the same as the player's symbol,
    // we can assume it is their turn

    myTurn = data.symbol !== symbol;

    // If the game is still going, show who's turn it is
    if (!isGameOver()) {
      if (gameTied()) {
        alert("Game Drawn.")
        $(".board button").attr("disabled", true);
      } else {
        renderTurnMessage();
      }
      // If the game is over
    } else {
      // Show the message for the loser
      if (myTurn) {
        alert("Game over. You lost.");
        // Show the message for the winner
      } else {
        alert("Congratulations ! You WON !")
      }
      // Disable the board
      $(".board button").attr("disabled", true);
    }
  });

  // Set up the initial state when the game begins
  socket.on("game.begin", function (data) {
    // The server will asign X or O to the player
    symbol = data.symbol;
    // Give X the first turn
    myTurn = symbol === "X";
    renderTurnMessage();
  });

  // Disable the board if the opponent leaves
  socket.on("opponent.left", function () {
    $("#messages").text("Your opponent left the game.");
    $(".board button").attr("disabled", true);
  });
});

function getBoardState() {
  var squares = [];
  // We will compose an array of all of the Xs and Ox
  // that are on the board
  $(".board button").each(function () {
    squares[$(this).attr("id")] = $(this).text() || "";
  });
  return squares;
}

function gameTied() {
  var state = getBoardState();

  for(var i=0;i<state.length;i++){
    if(state[i] === "")   
       return false;
  }
   return true;
}

function isGameOver() {
  var state = getBoardState(),
    // One of the rows must be equal to either of these
    // value for
    // the game to be over
    matches = ["XXXX", "OOOO"],
    // These are all of the possible combinations
    // that would win the game
    rows = [
      state[0] + state[1] + state[2] + state[3],
      state[41] + state[40] + state[39] + state[38],
      state[7] + state[8] + state[9] + state[10],
      state[34] + state[33] + state[32] + state[31],
      state[14] + state[15] + state[16] + state[17],
      state[27] + state[26] + state[25] + state[24],
      state[21] + state[22] + state[23] + state[24],
      state[20] + state[19] + state[18] + state[17],
      state[28] + state[29] + state[30] + state[31],
      state[13] + state[12] + state[11] + state[10],
      state[35] + state[36] + state[37] + state[38],
      state[6] + state[5] + state[4] + state[3],
      state[0] + state[7] + state[14] + state[21],
      state[41] + state[34] + state[27] + state[20],
      state[1] + state[8] + state[15] + state[22],
      state[40] + state[33] + state[26] + state[19],
      state[2] + state[9] + state[16] + state[23],
      state[39] + state[32] + state[25] + state[18],
      state[3] + state[10] + state[17] + state[24],
      state[38] + state[31] + state[24] + state[17],
      state[4] + state[11] + state[18] + state[25],
      state[37] + state[30] + state[23] + state[16],
      state[5] + state[12] + state[19] + state[26],
      state[36] + state[29] + state[22] + state[15],
      state[6] + state[13] + state[20] + state[27],
      state[35] + state[28] + state[21] + state[14],
      state[0] + state[8] + state[16] + state[24],
      state[41] + state[33] + state[25] + state[17],
      state[7] + state[15] + state[23] + state[31],
      state[34] + state[26] + state[18] + state[10],
      state[14] + state[22] + state[30] + state[38],
      state[27] + state[19] + state[11] + state[3],
      state[35] + state[29] + state[23] + state[17],
      state[6] + state[12] + state[18] + state[24],
      state[28] + state[22] + state[16] + state[10],
      state[13] + state[19] + state[25] + state[31],
      state[21] + state[15] + state[ 9] + state[3],
      state[20] + state[26] + state[32] + state[38],
      state[36] + state[30] + state[24] + state[18],
      state[5] + state[11] + state[17] + state[23],
      state[37] + state[31] + state[25] + state[19],
      state[4] + state[10] + state[16] + state[22],
      state[2] + state[10] + state[18] + state[26],
      state[39] + state[31] + state[23] + state[15],
      state[1] + state[9] + state[17] + state[25],
      state[40] + state[32] + state[24] + state[16],
      state[9] + state[7] + state[25] + state[33],
      state[8] + state[16] + state[24] + state[32],
      state[11] + state[7] + state[23] + state[29],
      state[12] + state[18] + state[24] + state[30],
      state[1] + state[2] + state[3] + state[4],
      state[5] + state[4] + state[3] + state[2],
      state[8] + state[9] + state[10] + state[11],
      state[12] + state[11] + state[10] + state[9],
      state[15] + state[16] + state[17] + state[18],
      state[19] + state[18] + state[17] + state[16],
      state[22] + state[23] + state[24] + state[25],
      state[26] + state[25] + state[24] + state[23],
      state[29] + state[30] + state[31] + state[32],
      state[33] + state[32] + state[31] + state[30],
      state[36] + state[37] + state[38] + state[39],
      state[40] + state[39] + state[38] + state[37],
      state[7] + state[14] + state[21] + state[28],
      state[8] + state[15] + state[22] + state[29],
      state[9] + state[16] + state[23] + state[30],
      state[10] + state[17] + state[24] + state[31],
      state[11] + state[18] + state[25] + state[32],
      state[12] + state[19] + state[26] + state[33],
      state[13] + state[20] + state[27] + state[34],
      state[42] + state[35] + state[28] + state[21],
      state[42] + state[36] + state[30] + state[24],
      state[43] + state[36] + state[29] + state[22],
      state[43] + state[37] + state[31] + state[25],
      state[44] + state[37] + state[30] + state[23],
      state[44] + state[38] + state[32] + state[26],
      state[45] + state[38] + state[31] + state[24],
      state[45] + state[37] + state[29] + state[21],
      state[45] + state[39] + state[33] + state[27],
      state[46] + state[39] + state[32] + state[25],
      state[46] + state[38] + state[30] + state[22],
      state[47] + state[40] + state[33] + state[26],
      state[47] + state[39] + state[31] + state[23],
      state[48] + state[41] + state[34] + state[27],
      state[48] + state[40] + state[32] + state[24],
      state[42] + state[43] + state[44] + state[45],
      state[43] + state[44] + state[45] + state[46],
      state[44] + state[45] + state[46] + state[47],
      state[45] + state[46] + state[47] + state[48]
    ];

  // to either 'XXXX' or 'OOOO'
  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      return true;
    }
  }
}

function renderTurnMessage() {
  // Disable the board if it is the opponents turn
  if (!myTurn) {
    $("#messages").text("Your opponent's turn");
    $(".board button").attr("disabled", true);
    // Enable the board if it is your turn
  } else {
    $("#messages").text("Your turn.");
    $(".board button").removeAttr("disabled");
  }
}

function makeMove(e) {
  e.preventDefault();
  // It's not your turn
  if (!myTurn) {
    return;
  }
  // The space is already checked
  if ($(this).text().length) {
    alert("This space is already taken !");
    return;
  }

  // The space is not allowed
  if (!$(this).hasClass("available")) {
    alert("This space is not available !");
    return;
  }

  // Emit the move to the server and make available other spaces


    if ($(this).hasClass("available left")) {
       nextId = parseInt($(this).attr("id")) + 1;
       nextClass = "available left";
    }else if ($(this).hasClass("available right")) {
       nextId = parseInt($(this).attr("id")) - 1;
       nextClass = "available right";
    }

      socket.emit("make.move", {
        nextClass: nextClass,
        nextId: nextId,
        symbol: symbol,
        position: $(this).attr("id"),
    });

}
