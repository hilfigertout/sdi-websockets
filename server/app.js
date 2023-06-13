const express = require('express');
const {Server} = require('socket.io');
const { createServer } = require("http");
const port = 8080;

const app = express();
const expressServer= createServer(app)
const socketServer = new Server(expressServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
  }
});

let players = 0;

let player1;
let player2;

let sequence = [];
let gameOver = false;
let currentTurn = 2;
let availableIds = [1, 2];

const resetGame = () => {
  sequence = [];
  gameOver = false;
  currentTurn = 2;
}



app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});

socketServer.on('connection', (socket) => {

  console.log("A player connected");
  players++;
  let playerId = availableIds.shift();
  if (!playerId) {
    console.log("Too many players");
    socket.emit("error", "Too many players on currently.");
    socket.disconnect(true);
    players--;
  } else {
    console.log(`assigning ID ${playerId}`);
    socket.emit('id-assign', playerId);
    socket.join('game');  
  }
  if (players === 2){
    console.log(`Starting game`);
    resetGame()
    socketServer.to('game').emit('game-start');
  }

  socket.on('sequence-finish', (color) => {
    console.log(`player ${playerId} added ${color} button`);
    if (playerId === currentTurn && !gameOver) {
      sequence.push(color);
      currentTurn = (playerId === 1 ? 2 : 1);
      socketServer.to('game').emit('sequence-finish', `${playerId} ${JSON.stringify(sequence)}`);
    }
  })

  socket.on('failure', (msg) => {
    console.log(`Player ${playerId} missed the sequence`);
    gameOver = true;
    socketServer.to('game').emit('game-end', `Loser: ${playerId}`);
    socketServer.disconnectSockets(true);
  })

  socket.on('disconnect', (socket) => {
    console.log(`Player ${playerId} disconnected`);
    players--;
    availableIds.push(playerId);
  });
})


app.get('/', (req, res) => {
  //TODO
})





expressServer.listen(port, () => console.log(`Express Server listening on port ${port}`));