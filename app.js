var express = require('express')
var app = express()
app.use(express.static('public'))
const port = process.env.PORT || 3000
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(port)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var players = {},
  unmatched;

  let typeOfGame;


io.sockets.on("connection", function (socket) {

  socket.on("real.player", function (data) {
     typeOfGame = "realPLayer";
    joinGame(socket, typeOfGame);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol,
      typeOfGame: typeOfGame
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol,
      typeOfGame: typeOfGame
    });
  }
  })
    
    socket.on("bot", function (data) {
       typeOfGame = "bot";
      joinGame(socket);

      socket.emit("game.begin", {
        symbol: players[socket.id].symbol,
        typeOfGame: typeOfGame
      });



    })

    console.log("socket connected")
  socket.emit('connection',{msg:"hello"})
  

  socket.on("make.move", function (data) {

    if (typeOfGame === "realPLayer") {
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
    }else if (typeOfGame === "bot") {
      socket.emit("move.made", data);

    }
  });

  socket.on("disconnect", function () {
    if (typeOfGame === "realPLayer") {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }}
    
  });
});

function joinGame(socket) {
  if (typeOfGame === "realPLayer") {
  players[socket.id] = {
    typeOfGame: typeOfGame,
    opponent: unmatched,
    symbol: "X",
    // The socket that is associated with this player
    socket: socket,
  };

  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }} else {
    players[socket.id] = {
      typeOfGame: typeOfGame,
      symbol: "X",
      socket: socket,
  }}
  }


function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
}
